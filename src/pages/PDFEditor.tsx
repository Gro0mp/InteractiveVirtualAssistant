// src/pages/PDFEditor.tsx
import React, { useCallback, useMemo, useRef, useState } from "react";
import { PDFDocument, degrees, rgb, StandardFonts } from "pdf-lib";
import { Document, Page, pdfjs } from "react-pdf";
import mammoth from "mammoth";
import { Document as DocxDocument, Packer, Paragraph, TextRun } from "docx";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

type Mode = "pdf" | "docx" | null;

type PdfOp =
    | { type: "rotate"; pageIndex: number; deltaDeg: 90 | -90 }
    | { type: "delete"; pageIndex: number }
    | { type: "move"; from: number; to: number }
    | {
    type: "addText";
    pageIndex: number;
    text: string;
    x: number;
    y: number;
    size: number;
};

function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement("a");
    a.href = url;
    a.download = filename;
    window.document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

async function applyPdfOps(inputBytes: Uint8Array, ops: PdfOp[]) {
    const pdfDoc = await PDFDocument.load(inputBytes);

    for (const op of ops) {
        if (op.type === "rotate") {
            const page = pdfDoc.getPage(op.pageIndex);
            const current = page.getRotation().angle ?? 0;
            page.setRotation(degrees((current + op.deltaDeg + 360) % 360));
        }

        if (op.type === "delete") {
            pdfDoc.removePage(op.pageIndex);
        }

        if (op.type === "move") {
            const pageCount = pdfDoc.getPageCount();
            if (
                op.from < 0 ||
                op.from >= pageCount ||
                op.to < 0 ||
                op.to >= pageCount ||
                op.from === op.to
            ) {
                continue;
            }
            const [p] = pdfDoc.getPages().splice(op.from, 1);
            const pages = pdfDoc.getPages();
            pages.splice(op.to, 0, p);
            // Rebuild by copying pages into a new document to reflect ordering reliably
            const rebuilt = await PDFDocument.create();
            const indices = Array.from({ length: pages.length }, (_v, i) => i);
            const copied = await rebuilt.copyPages(pdfDoc, indices);
            copied.forEach((cp) => rebuilt.addPage(cp));
            const bytes = await rebuilt.save();
            // Reload to continue applying subsequent ops
            return applyPdfOps(bytes, ops.slice(ops.indexOf(op) + 1));
        }

        if (op.type === "addText") {
            const page = pdfDoc.getPage(op.pageIndex);
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
            page.drawText(op.text, {
                x: op.x,
                y: op.y,
                size: op.size,
                font,
                color: rgb(0.1, 0.1, 0.1),
            });
        }
    }

    return pdfDoc.save();
}

function extractPlainTextFromHtml(html: string) {
    const tmp = window.document.createElement("div");
    tmp.innerHTML = html;
    return (tmp.textContent ?? "").replace(/\r\n/g, "\n");
}

export function PDFEditor() {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [mode, setMode] = useState<Mode>(null);
    const [originalName, setOriginalName] = useState<string>("");

    // PDF state
    const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
    const [numPages, setNumPages] = useState<number>(0);
    const [selectedPage, setSelectedPage] = useState<number>(0);
    const [ops, setOps] = useState<PdfOp[]>([]);
    const [textToAdd, setTextToAdd] = useState<string>("");

    // DOCX state (basic HTML editor)
    const [docxHtml, setDocxHtml] = useState<string>("");
    const [docxFileBytes, setDocxFileBytes] = useState<Uint8Array | null>(null);

    const resetAll = useCallback(() => {
        setMode(null);
        setOriginalName("");
        setPdfBytes(null);
        setNumPages(0);
        setSelectedPage(0);
        setOps([]);
        setTextToAdd("");
        setDocxHtml("");
        setDocxFileBytes(null);

        if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);
        setPdfPreviewUrl(null);

        if (fileInputRef.current) fileInputRef.current.value = "";
    }, [pdfPreviewUrl]);

    const loadPdf = useCallback(async (file: File) => {
        const buf = new Uint8Array(await file.arrayBuffer());
        setMode("pdf");
        setOriginalName(file.name);
        setPdfBytes(buf);

        const blob = new Blob([buf], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setPdfPreviewUrl(url);

        setOps([]);
        setSelectedPage(0);
    }, []);

    const loadDocx = useCallback(async (file: File) => {
        const buf = new Uint8Array(await file.arrayBuffer());
        setMode("docx");
        setOriginalName(file.name);
        setDocxFileBytes(buf);

        const result = await mammoth.convertToHtml({ arrayBuffer: buf.buffer });
        setDocxHtml(result.value || "<p></p>");
    }, []);

    const onPickFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const lower = file.name.toLowerCase();
        if (lower.endsWith(".pdf")) return loadPdf(file);
        if (lower.endsWith(".docx")) return loadDocx(file);

        alert("Unsupported file type. Please upload a PDF or a .docx file.");
    }, [loadDocx, loadPdf]);

    const effectivePdfBytes = useMemo(() => pdfBytes, [pdfBytes]);

    const applyAndRefreshPdf = useCallback(async () => {
        if (!pdfBytes) return;
        const updated = await applyPdfOps(pdfBytes, ops);
        const updatedBytes = new Uint8Array(updated);

        setPdfBytes(updatedBytes);
        setOps([]);

        if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);
        const newUrl = URL.createObjectURL(new Blob([updatedBytes], { type: "application/pdf" }));
        setPdfPreviewUrl(newUrl);
    }, [ops, pdfBytes, pdfPreviewUrl]);

    const rotateSelected = useCallback(
        (delta: 90 | -90) => {
            setOps((prev) => [...prev, { type: "rotate", pageIndex: selectedPage, deltaDeg: delta }]);
        },
        [selectedPage]
    );

    const deleteSelected = useCallback(() => {
        setOps((prev) => [...prev, { type: "delete", pageIndex: selectedPage }]);
    }, [selectedPage]);

    const moveSelected = useCallback(
        (dir: -1 | 1) => {
            setOps((prev) => {
                const to = selectedPage + dir;
                if (to < 0 || to >= numPages) return prev;
                return [...prev, { type: "move", from: selectedPage, to }];
            });
            setSelectedPage((p) => {
                const next = p + dir;
                if (next < 0 || next >= numPages) return p;
                return next;
            });
        },
        [numPages, selectedPage]
    );

    const addText = useCallback(() => {
        const text = textToAdd.trim();
        if (!text) return;
        // Naive placement: bottom-left margin
        setOps((prev) => [
            ...prev,
            { type: "addText", pageIndex: selectedPage, text, x: 48, y: 48, size: 14 },
        ]);
        setTextToAdd("");
    }, [selectedPage, textToAdd]);

    const savePdf = useCallback(() => {
        if (!pdfBytes) return;
        const name = originalName.toLowerCase().endsWith(".pdf") ? originalName : "edited.pdf";
        // Fix the type mismatch here: pdfBytes is a Uint8Array, but Blob expects an ArrayBuffer or ArrayBufferView (which Uint8Array is), however there's some quirk in the expected input for BlobPart that causes TypeScript to not recognize it directly. Casting to unknown first is a workaround to bypass this issue, but it should be safe since Uint8Array is compatible with what Blob expects.
        downloadBlob(new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" }), name);
    }, [originalName, pdfBytes]);

    const exportDocx = useCallback(async () => {
        if (!mode || mode !== "docx") return;

        const plain = extractPlainTextFromHtml(docxHtml);
        const paragraphs = plain.split("\n").map((line) =>
            new Paragraph({
                children: [new TextRun(line)],
            })
        );

        const doc = new DocxDocument({
            sections: [{ properties: {}, children: paragraphs.length ? paragraphs : [new Paragraph("")] }],
        });

        const blob = await Packer.toBlob(doc);
        const base =
            originalName.toLowerCase().endsWith(".docx")
                ? originalName.replace(/\.docx$/i, "")
                : "document";
        downloadBlob(blob, `${base}-edited.docx`);
    }, [docxHtml, mode, originalName]);

    return (
        <div className="min-h-screen bg-white text-slate-950">
            <div className="mx-auto max-w-[1120px] px-5 pb-14 pt-7">
                <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="m-0 text-2xl font-bold tracking-[-0.02em]">Editor</h1>
                        <div className="mt-1.5 text-[13px] leading-snug text-slate-900/60">
                            Upload a PDF or \.docx to preview and apply common edits\.
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            onChange={onPickFile}
                            className="block w-full max-w-[360px] text-[13px]"
                        />
                        <button
                            type="button"
                            onClick={resetAll}
                            className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-900/10 bg-white px-3 text-[13px] font-semibold"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                {mode === null && (
                    <div className="rounded-[18px] border border-slate-900/10 bg-white p-4 text-[13px] text-slate-900/70">
                        No file loaded\.
                    </div>
                )}

                {mode === "pdf" && (
                    <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-[1fr_360px]">
                        <section className="rounded-[18px] border border-slate-900/10 bg-white p-3.5">
                            {pdfPreviewUrl && (
                                <Document
                                    file={pdfPreviewUrl}
                                    onLoadSuccess={(info) => setNumPages(info.numPages)}
                                    loading={<div className="text-[13px] text-slate-900/70">Loading PDF...</div>}
                                >
                                    <div className="mb-2 flex flex-wrap items-center gap-2">
                                        <label className="text-[13px] font-semibold">Page</label>
                                        <select
                                            value={selectedPage}
                                            onChange={(e) => setSelectedPage(Number(e.target.value))}
                                            className="h-9 rounded-xl border border-slate-900/10 bg-white px-3 text-[13px]"
                                        >
                                            {Array.from({ length: numPages }, (_v, i) => (
                                                <option key={i} value={i}>
                                                    {i + 1} / {numPages}
                                                </option>
                                            ))}
                                        </select>

                                        <div className="ml-auto text-[12px] text-slate-900/60">
                                            Pending ops: {ops.length}
                                        </div>
                                    </div>

                                    <div className="overflow-hidden rounded-xl border border-slate-900/10">
                                        <Page pageNumber={selectedPage + 1} width={740} />
                                    </div>
                                </Document>
                            )}
                        </section>

                        <aside className="rounded-[18px] border border-slate-900/10 bg-white p-3.5">
                            <div className="mb-2 text-[13px] font-extrabold">PDF tools</div>

                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => rotateSelected(-90)}
                                    className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-900/10 bg-white px-3 text-[13px] font-semibold"
                                    disabled={!effectivePdfBytes}
                                >
                                    Rotate \-90°
                                </button>
                                <button
                                    type="button"
                                    onClick={() => rotateSelected(90)}
                                    className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-900/10 bg-white px-3 text-[13px] font-semibold"
                                    disabled={!effectivePdfBytes}
                                >
                                    Rotate \+90°
                                </button>
                                <button
                                    type="button"
                                    onClick={deleteSelected}
                                    className="inline-flex h-9 items-center justify-center rounded-xl border border-rose-500/25 bg-white px-3 text-[13px] font-semibold"
                                    disabled={!effectivePdfBytes || numPages <= 1}
                                >
                                    Delete page
                                </button>
                                <button
                                    type="button"
                                    onClick={() => moveSelected(-1)}
                                    className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-900/10 bg-white px-3 text-[13px] font-semibold"
                                    disabled={!effectivePdfBytes || selectedPage <= 0}
                                >
                                    Move up
                                </button>
                                <button
                                    type="button"
                                    onClick={() => moveSelected(1)}
                                    className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-900/10 bg-white px-3 text-[13px] font-semibold"
                                    disabled={!effectivePdfBytes || selectedPage >= numPages - 1}
                                >
                                    Move down
                                </button>
                            </div>

                            <div className="mt-3.5 border-t border-slate-900/10 pt-3.5">
                                <div className="mb-2 text-[13px] font-extrabold">Add text</div>
                                <div className="flex gap-2">
                                    <input
                                        value={textToAdd}
                                        onChange={(e) => setTextToAdd(e.target.value)}
                                        placeholder="Text to stamp on page"
                                        className="h-9 w-full rounded-xl border border-slate-900/10 bg-white px-3 text-[13px] outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={addText}
                                        className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-900/10 bg-white px-3 text-[13px] font-semibold"
                                        disabled={!effectivePdfBytes}
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="mt-2 text-[12px] text-slate-900/60">
                                    Text is added at a fixed position (x: 48, y: 48)\.
                                </div>
                            </div>

                            <div className="mt-3.5 flex flex-wrap gap-2 border-t border-slate-900/10 pt-3.5">
                                <button
                                    type="button"
                                    onClick={applyAndRefreshPdf}
                                    className="inline-flex h-9 items-center justify-center rounded-xl border border-violet-500/25 bg-white px-3 text-[13px] font-semibold"
                                    disabled={!effectivePdfBytes || ops.length === 0}
                                >
                                    Apply ops
                                </button>
                                <button
                                    type="button"
                                    onClick={savePdf}
                                    className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-900/10 bg-white px-3 text-[13px] font-semibold"
                                    disabled={!effectivePdfBytes}
                                >
                                    Download PDF
                                </button>
                            </div>
                        </aside>
                    </div>
                )}

                {mode === "docx" && (
                    <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-[1fr_360px]">
                        <section className="rounded-[18px] border border-slate-900/10 bg-white p-3.5">
                            <div className="mb-2 text-[13px] font-extrabold">DOCX editor (basic)</div>

                            <div
                                contentEditable
                                suppressContentEditableWarning
                                onInput={(e) => setDocxHtml((e.target as HTMLDivElement).innerHTML)}
                                dangerouslySetInnerHTML={{ __html: docxHtml }}
                                className="min-h-[520px] rounded-xl border border-slate-900/10 bg-white p-3 text-[14px] leading-relaxed outline-none"
                            />
                            <div className="mt-2 text-[12px] text-slate-900/60">
                                This is a simplified editor (HTML)\. Complex \.docx formatting may not round\-trip perfectly\.
                            </div>
                        </section>

                        <aside className="rounded-[18px] border border-slate-900/10 bg-white p-3.5">
                            <div className="mb-2 text-[13px] font-extrabold">DOCX tools</div>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (!docxFileBytes) return;
                                        downloadBlob(
                                            // Fix this later: we shouldn't need to cast to unknown here, but there's a type mismatch in the expected input for BlobPart that I'm not sure how to resolve right now
                                            new Blob([docxFileBytes as unknown as BlobPart], {
                                                type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                                            }),
                                            originalName || "document.docx"
                                        );
                                    }}
                                    className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-900/10 bg-white px-3 text-[13px] font-semibold"
                                    disabled={!docxFileBytes}
                                >
                                    Download original
                                </button>

                                <button
                                    type="button"
                                    onClick={exportDocx}
                                    className="inline-flex h-9 items-center justify-center rounded-xl border border-violet-500/25 bg-white px-3 text-[13px] font-semibold"
                                    disabled={!docxHtml}
                                >
                                    Export edited \.docx
                                </button>
                            </div>
                        </aside>
                    </div>
                )}
            </div>
        </div>
    );
}
