package com.mindhub.homebanking.models;

import java.awt.*;
import java.util.List;


import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;


public class TransactionPDFExporter {
    private List<Transaction> listTransactions;

    public TransactionPDFExporter (List<Transaction> listTransactions) {
        this.listTransactions = listTransactions;
    }

    private void writeTableHeader(PdfPTable table) {
        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(Color.BLUE);
        cell.setPadding(5);

        Font font = FontFactory.getFont(FontFactory.HELVETICA);
        font.setColor(Color.WHITE);

        cell.setPhrase(new Phrase("User ID", font));

        table.addCell(cell);

        cell.setPhrase(new Phrase("Date and time", font));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Amount", font));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Type", font));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Description", font));
        table.addCell(cell);
    }

    private void writeTableData(PdfPTable table) {
        for (Transaction transaction : listTransactions) {
            table.addCell(String.valueOf(transaction.getId()));
            table.addCell(String.valueOf(transaction.getCreationDate()));
            table.addCell(String.valueOf(transaction.getAmount()));
            table.addCell(String.valueOf(transaction.getType()));
            table.addCell(String.valueOf(transaction.getDescription().toString()));
        }
    }


}
