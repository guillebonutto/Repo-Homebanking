package com.mindhub.homebanking.services;

import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.Image;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.mindhub.homebanking.models.Account;
import com.mindhub.homebanking.models.Client;
import com.mindhub.homebanking.models.Transaction;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletResponse;
import java.awt.*;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
public class PDFGeneratorService {
    public void export(HttpServletResponse response, Client client, Account account, String fromDate, String toDate) throws DocumentException, IOException {

        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, response.getOutputStream());

        document.open();

        Font fontTitle = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        fontTitle.setSize(18);
        // System.out.println(Arrays.toString(Color.RGBtoHSB(109, 162, 30, null)));

        fontTitle.setColor(Color.getHSBColor(0.23358588F, 0.8148148F, 0.63529414F));

        Paragraph Title = new Paragraph("Transactions", fontTitle);
        Title.setAlignment(Paragraph.ALIGN_CENTER);

        Font fontParagraph = FontFactory.getFont(FontFactory.HELVETICA);
        fontParagraph.setSize(12);

        PdfPTable table = new PdfPTable(4);

        table.setWidthPercentage(100f);
        table.setWidths(new float[]{2.0f, 5.0f, 3.0f, 3.0f});
        table.setSpacingBefore(10);

        writeTableHeader(table);
        writeTableData(table, account,fromDate,toDate);

        Paragraph paragraph = new Paragraph("Client: " + client.getFirstName() + " " + client.getLastName() + " - Account Nº: " + account.getNumber(), fontParagraph);
        paragraph.setAlignment(Paragraph.ALIGN_LEFT);

        Paragraph balance = new Paragraph("Balance: $" + account.getBalance(), fontParagraph);
        paragraph.setAlignment(Paragraph.ALIGN_LEFT);

        //Creo una fila donde indico le fecha desde y hasta de las cuales realizo el filtro para mostrar las transacciones
        Paragraph subtitle = new Paragraph("Account movements from: " + fromDate+  " - to: "+ toDate,fontTitle);
        subtitle.setAlignment(Paragraph.ALIGN_LEFT);

        // Creating a Document object
        Image imageData = Image.getInstance("./src/main/resources/static/images/logo_pdf.png");
        imageData.setAlignment(Image.ALIGN_CENTER);
        document.add(imageData);
        document.add(Title);
        document.add(paragraph);
        document.add(balance);
        document.add(subtitle);
        document.add(table);
        document.close();

    }

    private void writeTableHeader(PdfPTable table) {
        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(Color.getHSBColor(0.23251028F, 0.3266129F, 0.972549F));
        cell.setPadding(5);

        Font font = FontFactory.getFont(FontFactory.HELVETICA);
        font.setColor(Color.BLACK);

        cell.setPhrase(new Phrase("Date and time", font));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Amount", font));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Type", font));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Description", font));
        table.addCell(cell);
    }

    private void writeTableData(PdfPTable table, Account account, String fromDate, String toDate) {
        PdfPCell newCell = new PdfPCell();
        newCell.setBackgroundColor(Color.WHITE);
        newCell.setPadding(5);

        Font font = FontFactory.getFont(FontFactory.HELVETICA);
        font.setColor(Color.BLACK);

        DateTimeFormatter aFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy - HH:mm");

        Set<Transaction> transactions = account.getTransactions();

        AtomicInteger number = new AtomicInteger();
        number.set(1);

        filterTransactionsBetweenDates(fromDate, toDate, transactions).

                forEach(transaction ->

                {
                    changeColor(number,newCell,font);

                    newCell.setPhrase(new Phrase(transaction.getCreationDate().format(aFormatter), font));
                    table.addCell(newCell);

                    newCell.setPhrase(new Phrase("$" +transaction.getAmount(), font));
                    table.addCell(newCell);

                    newCell.setPhrase(new Phrase(String.valueOf(transaction.getType()), font));
                    table.addCell(newCell);

                    newCell.setPhrase(new Phrase(String.valueOf(transaction.getDescription()), font));
                    table.addCell(newCell);
                    number.getAndIncrement();

                });
    }

    public static boolean esPar(int number) {
        return number % 2 == 0;
    }

    public static void changeColor(AtomicInteger number, PdfPCell newCell,Font font){
        if (esPar(number.get())){
            newCell.setBackgroundColor(Color.getHSBColor(0.23251028F, 0.3266129F, 0.972549F));
            font.setColor(Color.DARK_GRAY);
        }else
        {
            newCell.setBackgroundColor(Color.WHITE);
            font.setColor(Color.BLACK);
        }
    }

    public Set<Transaction> filterTransactionsBetweenDates(String fromDate, String toDate, Set<Transaction> transactions) {

        DateTimeFormatter aFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        return transactions.stream().filter(transaction -> {

            return transaction.getCreationDate().format(aFormatter).compareTo(fromDate) >= 0 && transaction.getCreationDate().format(aFormatter).compareTo(toDate) <= 0;
        }).collect(Collectors.toSet());
    }

}
