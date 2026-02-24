// `src/components/invoices/Invoice.tsx`
import React, { useMemo, useState } from 'react'
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer'

type TemplateId = 'simple' | 'professional' | 'blank'

type InvoiceProps = {
    template: TemplateId
}

type PdfLineItem = {
    desc: string
    taxed: boolean
    amount: number
}

function getPdfStyles(template: TemplateId) {
    const palette =
        template === 'professional'
            ? {
                bar: '#4F46E5',
                barText: '#FFFFFF',
                heading: '#0F172A',
                tableHeader: '#334155',
                stripe: '#F8FAFC',
                border: '#CBD5E1',
                lightBorder: '#E2E8F0',
                metaFill: '#F1F5F9',
            }
            : template === 'blank'
                ? {
                    bar: '#0F172A',
                    barText: '#FFFFFF',
                    heading: '#0F172A',
                    tableHeader: '#0F172A',
                    stripe: '#FFFFFF',
                    border: '#CBD5E1',
                    lightBorder: '#E2E8F0',
                    metaFill: '#F8FAFC',
                }
                : {
                    bar: '#475569',
                    barText: '#FFFFFF',
                    heading: '#0F172A',
                    tableHeader: '#475569',
                    stripe: '#F8FAFC',
                    border: '#CBD5E1',
                    lightBorder: '#E2E8F0',
                    metaFill: '#F1F5F9',
                }

    return StyleSheet.create({
        page: {
            backgroundColor: '#FFFFFF',
            paddingTop: 28,
            paddingRight: 30,
            paddingBottom: 26,
            paddingLeft: 30,
            fontSize: 10,
            color: '#0F172A',
            fontFamily: 'Helvetica',
        },

        headerRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 14,
        },
        companyName: { fontSize: 22, color: palette.heading, fontWeight: 700 },
        companyMeta: { marginTop: 6, color: '#334155', lineHeight: 1.3 },

        invoiceTitle: {
            fontSize: 24,
            letterSpacing: 1,
            color: '#94A3B8',
            fontWeight: 800,
            textAlign: 'right',
        },

        rightMetaTable: {
            marginTop: 10,
            alignSelf: 'flex-end',
            width: 210,
        },
        metaRow: { flexDirection: 'row', alignItems: 'stretch' },
        metaLabel: {
            width: 90,
            textAlign: 'right',
            paddingRight: 8,
            paddingTop: 4,
            paddingBottom: 4,
            fontSize: 9,
            color: '#0F172A',
        },
        metaValue: {
            width: 120,
            borderWidth: 1,
            borderColor: palette.border,
            backgroundColor: palette.metaFill,
            paddingTop: 4,
            paddingBottom: 4,
            paddingLeft: 8,
            fontSize: 9,
            color: '#0F172A',
        },

        sectionBar: {
            backgroundColor: palette.bar,
            color: palette.barText,
            paddingTop: 4,
            paddingBottom: 4,
            paddingLeft: 8,
            fontSize: 9,
            fontWeight: 700,
            textTransform: 'uppercase',
        },

        billToBox: {
            width: 260,
            borderWidth: 1,
            borderColor: palette.border,
            borderTopWidth: 0,
            paddingTop: 8,
            paddingBottom: 8,
            paddingLeft: 10,
            paddingRight: 10,
            lineHeight: 1.35,
        },

        table: {
            marginTop: 14,
            borderWidth: 1,
            borderColor: palette.border,
        },
        tableHeaderRow: {
            flexDirection: 'row',
            backgroundColor: palette.tableHeader,
            color: '#FFFFFF',
            paddingTop: 4,
            paddingBottom: 4,
            paddingLeft: 8,
            paddingRight: 8,
            fontSize: 9,
            fontWeight: 700,
            textTransform: 'uppercase',
        },
        thDesc: { flexGrow: 1 },
        thTax: { width: 55, textAlign: 'center' },
        thAmt: { width: 85, textAlign: 'right' },

        tr: {
            flexDirection: 'row',
            paddingTop: 4,
            paddingBottom: 4,
            paddingLeft: 8,
            paddingRight: 8,
            borderTopWidth: 1,
            borderTopColor: palette.lightBorder,
            minHeight: 18,
        },
        tdDesc: { flexGrow: 1, paddingRight: 8 },
        tdTax: { width: 55, textAlign: 'center' },
        tdAmt: { width: 85, textAlign: 'right' },

        bottomRow: { flexDirection: 'row', marginTop: 14 },

        commentsWrap: { width: 380, marginRight: 16 },
        commentsBox: {
            borderWidth: 1,
            borderColor: palette.border,
            borderTopWidth: 0,
            paddingTop: 8,
            paddingBottom: 8,
            paddingLeft: 10,
            paddingRight: 10,
            minHeight: 78,
            lineHeight: 1.35,
        },

        totalsWrap: { flexGrow: 1, alignItems: 'flex-end' },
        totalsTable: {
            width: 210,
            borderWidth: 1,
            borderColor: palette.border,
        },
        totalsRow: {
            flexDirection: 'row',
            borderTopWidth: 1,
            borderTopColor: palette.lightBorder,
        },
        totalsLabel: { flexGrow: 1, paddingTop: 4, paddingBottom: 4, paddingLeft: 10, fontSize: 9 },
        totalsValue: {
            width: 85,
            paddingTop: 4,
            paddingBottom: 4,
            paddingRight: 10,
            textAlign: 'right',
            fontSize: 9,
        },
        totalRow: {
            flexDirection: 'row',
            backgroundColor: palette.metaFill,
            borderTopWidth: 1,
            borderTopColor: palette.border,
        },
        totalLabel: { flexGrow: 1, paddingTop: 5, paddingBottom: 5, paddingLeft: 10, fontSize: 10, fontWeight: 800 },
        totalValue: { width: 85, paddingTop: 5, paddingBottom: 5, paddingRight: 10, textAlign: 'right', fontSize: 10, fontWeight: 800 },

        payTo: { marginTop: 12, width: 210, fontSize: 9, lineHeight: 1.3, textAlign: 'center', color: '#0F172A' },

        footer: { marginTop: 18, textAlign: 'center', fontSize: 9, color: '#0F172A' },
        thanks: { marginTop: 6, textAlign: 'center', fontSize: 10, fontStyle: 'italic', fontWeight: 700 },
    })
}

function formatMoney(n: number) {
    return n.toFixed(2)
}

function InvoiceDoc({ template }: { template: TemplateId }) {
    const s = useMemo(() => getPdfStyles(template), [template])

    // Explicit type fixes TS7034/TS7005
    const items: PdfLineItem[] = []

    const [now] = useState(() => new Date())

    const subtotal = items.reduce((sum, it) => sum + it.amount, 0)
    const taxable = items.filter(i => i.taxed).reduce((sum, it) => sum + it.amount, 0)
    const taxRate = 0.0625
    const tax = taxable * taxRate
    const total = subtotal + tax

    const totalRowsToShow = 10
    const padded: PdfLineItem[] = [...items]
    while (padded.length < totalRowsToShow) padded.push({ desc: '', taxed: false, amount: 0 })

    return (
        <Document>
            <Page size="A4" style={s.page}>
                <View style={s.headerRow}>
                    <View style={{ width: 320 }}>
                        <Text style={s.companyName}>Company Name</Text>
                        <Text style={s.companyMeta}>
                            [Street Address]{'\n'}[City, ST ZIP]{'\n'}Phone: [000-000-0000]{'\n'}Fax: [000-000-0000]{'\n'}Website: somedomain.com
                        </Text>
                    </View>

                    <View style={{ width: 220, alignItems: 'flex-end' }}>
                        <Text style={s.invoiceTitle}>INVOICE</Text>

                        <View style={s.rightMetaTable}>
                            <View style={s.metaRow}>
                                <Text style={s.metaLabel}>DATE</Text>
                                <Text style={s.metaValue}>{now.toLocaleDateString()}</Text>
                            </View>
                            <View style={s.metaRow}>
                                <Text style={s.metaLabel}>INVOICE \#</Text>
                                <Text style={s.metaValue}>123456</Text>
                            </View>
                            <View style={s.metaRow}>
                                <Text style={s.metaLabel}>CUSTOMER ID</Text>
                                <Text style={s.metaValue}>[123]</Text>
                            </View>
                            <View style={s.metaRow}>
                                <Text style={s.metaLabel}>DUE DATE</Text>
                                <Text style={s.metaValue}>1/8/2020</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={{ width: 260 }}>
                    <Text style={s.sectionBar}>BILL TO</Text>
                    <View style={s.billToBox}>
                        <Text>[Name]</Text>
                        <Text>[Company Name]</Text>
                        <Text>[Street Address]</Text>
                        <Text>[City, ST ZIP]</Text>
                        <Text>[Phone]</Text>
                    </View>
                </View>

                <View style={s.table}>
                    <View style={s.tableHeaderRow}>
                        <Text style={s.thDesc}>DESCRIPTION</Text>
                        <Text style={s.thTax}>TAXED</Text>
                        <Text style={s.thAmt}>AMOUNT</Text>
                    </View>

                    <View>
                        {padded.map((it, idx) => {
                            const isStripe = idx % 2 === 1
                            return (
                                <View
                                    key={idx}
                                    style={[
                                        s.tr,
                                        isStripe ? ({ backgroundColor: (getPdfStyles(template) as any)._getStyle?.().stripe } as any) : null,
                                    ]}
                                >
                                    <Text style={s.tdDesc}>{it.desc}</Text>
                                    <Text style={s.tdTax}>{it.taxed ? 'X' : ''}</Text>
                                    <Text style={s.tdAmt}>{it.amount ? formatMoney(it.amount) : ''}</Text>
                                </View>
                            )
                        })}
                    </View>
                </View>

                <View style={s.bottomRow}>
                    <View style={s.commentsWrap}>
                        <Text style={s.sectionBar}>OTHER COMMENTS</Text>
                        <View style={s.commentsBox}>
                            <Text>1\.\u00A0Total payment due in 30 days</Text>
                            <Text>2\.\u00A0Please include the invoice number on your check</Text>
                        </View>
                    </View>

                    <View style={s.totalsWrap}>
                        <View style={s.totalsTable}>
                            <View style={s.totalsRow}>
                                <Text style={s.totalsLabel}>Subtotal</Text>
                                <Text style={s.totalsValue}>{formatMoney(subtotal)}</Text>
                            </View>
                            <View style={s.totalsRow}>
                                <Text style={s.totalsLabel}>Taxable</Text>
                                <Text style={s.totalsValue}>{formatMoney(taxable)}</Text>
                            </View>
                            <View style={s.totalsRow}>
                                <Text style={s.totalsLabel}>Tax rate</Text>
                                <Text style={s.totalsValue}>{(taxRate * 100).toFixed(3)}%</Text>
                            </View>
                            <View style={s.totalsRow}>
                                <Text style={s.totalsLabel}>Tax due</Text>
                                <Text style={s.totalsValue}>{formatMoney(tax)}</Text>
                            </View>
                            <View style={s.totalRow}>
                                <Text style={s.totalLabel}>TOTAL</Text>
                                <Text style={s.totalValue}>{formatMoney(total)}</Text>
                            </View>
                        </View>

                        <Text style={s.payTo}>
                            Make all checks payable to{'\n'}[Your Company Name]
                        </Text>
                    </View>
                </View>

                <Text style={s.footer}>
                    If you have any questions about this invoice, please contact{'\n'}[Name, Phone \#, E-mail]
                </Text>
                <Text style={s.thanks}>Thank You For Your Business\!</Text>
            </Page>
        </Document>
    )
}

export function Invoice({ template }: InvoiceProps) {
    return (
        <div className="bg-slate-50 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-white border-b border-slate-200 flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-900">Invoice Preview</div>
                <div className="text-xs text-slate-500">
                    Template: <span className="font-medium text-slate-700">{template}</span>
                </div>
            </div>

            <div className="p-3">
                <div className="h-[680px] bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
                        <InvoiceDoc template={template} />
                    </PDFViewer>
                </div>
            </div>
        </div>
    )
}
