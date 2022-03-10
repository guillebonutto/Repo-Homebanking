package com.mindhub.homebanking;

import com.mindhub.homebanking.models.*;
import com.mindhub.homebanking.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;

@SpringBootApplication
public class HomebankingApplication {

    public static void main(String[] args) {
        SpringApplication.run(HomebankingApplication.class, args);
    }

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initData(ClientRepository clientRepository, AccountRepository accountRepository, TransactionRepository transactionRepository, LoanRepository loanRepository, ClientLoanRepository clientLoanRepository, CardRepository cardRepository) {
        return (args) -> {
            Client client1 = new Client("../images/melba.jpg", "Melba", "Morel", "melba@mindhub.com", passwordEncoder.encode("melba"));
            Client client2 = new Client("../images/guille.jpg", "Guille", "Bonutto", "guillebonutto@hotmail.com", passwordEncoder.encode("guille"));
            Client admin = new Client("../images/guille.jpg", "admin", "admin", "guille@hotmail.com", passwordEncoder.encode("admin"));

            clientRepository.save(client1);
            clientRepository.save(client2);
            clientRepository.save(admin);

            LocalDateTime today = LocalDateTime.now();     //Today
            LocalDateTime tomorrow = today.plusDays(1);     //Plus 1 day


            Account vin001 = new Account("VIN001", today, 5000, AccountType.SAVING_ACCOUNT, false, client1);
            Account vin002 = new Account("VIN002", tomorrow, 7500, AccountType.CHECKING_ACCOUNT, false, client1);
            Account vin003 = new Account("VIN003", tomorrow, 1500.3, AccountType.SAVING_ACCOUNT, false, client2);
            Account vin004 = new Account("VIN004", today, 160000.5, AccountType.CHECKING_ACCOUNT, false, client2);
            Account account1 = new Account("Account1", today, 10000, AccountType.SAVING_ACCOUNT, false, admin);

            accountRepository.save(vin001);
            accountRepository.save(vin002);
            accountRepository.save(vin003);
            accountRepository.save(vin004);
            accountRepository.save(account1);

            Transaction transaction1 = new Transaction(TransactionType.DEBIT, 3500.5, "Shop accessories", LocalDateTime.now(), vin002);
            Transaction transaction2 = new Transaction(TransactionType.DEBIT, -2500.5, "Payment services", LocalDateTime.now(), vin001);
            Transaction transaction3 = new Transaction(TransactionType.DEBIT, -1000, "Food", LocalDateTime.now(), vin001);
            Transaction transaction4 = new Transaction(TransactionType.DEBIT, 10000, "Shop accessories", LocalDateTime.now(), vin002);
            Transaction transaction5 = new Transaction(TransactionType.DEBIT, -10000, "Shop accessories", LocalDateTime.now(), vin002);
            Transaction transaction6 = new Transaction(TransactionType.CREDIT, 5500.7, "Deposit money from PayPal", LocalDateTime.now(), vin003);
            Transaction transaction7 = new Transaction(TransactionType.CREDIT, 3000.4, "Deposit money from PayPal", LocalDateTime.now(), vin003);
            Transaction transaction8 = new Transaction(TransactionType.DEBIT, -8000.4, "Power supply for PC", LocalDateTime.now(), vin003);
            Transaction transaction9 = new Transaction(TransactionType.CREDIT, 2500, "Deposit money from PayPal", LocalDateTime.now(), vin003);
            Transaction transaction10 = new Transaction(TransactionType.DEBIT, -1500.4, "Microphone", LocalDateTime.now(), vin003);
            Transaction transaction11 = new Transaction(TransactionType.CREDIT, 127500.3, "Deposit money from ML", LocalDateTime.now(), vin004);
            Transaction transaction12 = new Transaction(TransactionType.DEBIT, -1000.5, "Accessories", LocalDateTime.now(), vin004);
            Transaction transaction13 = new Transaction(TransactionType.DEBIT, -500, "Home services", LocalDateTime.now(), vin004);
            Transaction transaction14 = new Transaction(TransactionType.CREDIT, 34000.7, "Work", LocalDateTime.now(), vin004);

            transactionRepository.save(transaction1);
            transactionRepository.save(transaction2);
            transactionRepository.save(transaction3);
            transactionRepository.save(transaction4);
            transactionRepository.save(transaction5);
            transactionRepository.save(transaction6);
            transactionRepository.save(transaction7);
            transactionRepository.save(transaction8);
            transactionRepository.save(transaction9);
            transactionRepository.save(transaction10);
            transactionRepository.save(transaction11);
            transactionRepository.save(transaction12);
            transactionRepository.save(transaction13);
            transactionRepository.save(transaction14);

            Loan loan1 = new Loan("Mortgage", 500000.0, 20, Arrays.asList(12, 24, 36, 48, 60));
            Loan loan2 = new Loan("Personal", 100000.0, 45, Arrays.asList(6, 12, 24));
            Loan loan3 = new Loan("Auto", 300000.0, 15, Arrays.asList(6, 12, 24, 36));

            loanRepository.save(loan1);
            loanRepository.save(loan2);
            loanRepository.save(loan3);

            ClientLoan clientLoan1 = new ClientLoan(400000.0, loan1.getDues().get(4), (400000.0 / loan1.getDues().get(4)) * 1.2, client1, loan1);
            ClientLoan clientLoan2 = new ClientLoan(50000.0, loan2.getDues().get(1), (50000.0 / loan2.getDues().get(1)) * 1.45, client1, loan2);
            ClientLoan clientLoan3 = new ClientLoan(100000.0, loan2.getDues().get(2), (100000.0 / loan2.getDues().get(2)) * 1.45, client2, loan2);
            ClientLoan clientLoan4 = new ClientLoan(200000.0, loan3.getDues().get(3), (200000.0 / loan3.getDues().get(3)) * 1.15, client2, loan3);

            clientLoanRepository.save(clientLoan1);
            clientLoanRepository.save(clientLoan2);
            clientLoanRepository.save(clientLoan3);
            clientLoanRepository.save(clientLoan4);

            Card card1 = new Card(client1.getFirstName() + " " + client1.getLastName(), CardType.DEBIT, CardColor.GOLD, "5452-9870-8510-1879", 233, LocalDate.now().plusYears(5), LocalDate.now(), false, "VIN001", client1, vin001);
            Card card2 = new Card(client1.getFirstName() + " " + client1.getLastName(), CardType.CREDIT, CardColor.TITANIUM, "4166-2187-3211-2462", 358, LocalDate.now().plusYears(5), LocalDate.now(), false, "VIN002", client1, vin002);
            Card card3 = new Card(client2.getFirstName() + " " + client2.getLastName(), CardType.CREDIT, CardColor.SILVER, "4593-8743-1652-6597", 981, LocalDate.now().plusYears(5), LocalDate.now(), false, "VIN003", client2, vin003);

            cardRepository.save(card1);
            cardRepository.save(card2);
            cardRepository.save(card3);
        };
    }
}
