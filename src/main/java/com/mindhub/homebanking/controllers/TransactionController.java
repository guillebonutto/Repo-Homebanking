package com.mindhub.homebanking.controllers;

import com.mindhub.homebanking.dtos.TransactionDTO;
import com.mindhub.homebanking.models.*;
import com.mindhub.homebanking.services.AccountService;
import com.mindhub.homebanking.services.ClientService;
import com.mindhub.homebanking.services.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;


@RestController
@RequestMapping("/api")
public class TransactionController {

    @Autowired
    ClientService clientService;

    @Autowired
    AccountService accountService;

    @Autowired
    TransactionService transactionService;

    public TransactionController() {
    }

    @Transactional
    @RequestMapping("/transactions")
    public List<TransactionDTO> getTransactions() { return transactionService.getTransactions(); }

    @PostMapping(path = "/transactions")
    public ResponseEntity<Object> createTransaction(Authentication authentication, @RequestParam Double amount, @RequestParam String description,
                                                                                   @RequestParam String originAccount, @RequestParam String destinyAccount) {

        Client client = clientService.findClientByEmail(authentication.getName());
        Account account1 = accountService.findByNumber(originAccount);
        Account account2 = accountService.findByNumber(destinyAccount);

        if(amount == null || description.isEmpty() || originAccount.isEmpty() || destinyAccount.isEmpty()) {
            return new ResponseEntity<>("Missing data", HttpStatus.FORBIDDEN);
        }

        if (originAccount.equals(destinyAccount)) {
            return new ResponseEntity<>("Accounts are the same", HttpStatus.FORBIDDEN);
        }

        if (accountService.findByNumber(originAccount) == null || accountService.findByNumber(destinyAccount) == null) {
            return new ResponseEntity<>("Account not found", HttpStatus.FORBIDDEN);
        }

        if (accountService.findByNumber(destinyAccount) == null || accountService.findByNumber(destinyAccount) == null) {
            return new ResponseEntity<>("Account not found", HttpStatus.FORBIDDEN);
        }

        if (!client.getAccounts().contains(account1)) {
            return new ResponseEntity<>("This account doesn't belong to the client", HttpStatus.FORBIDDEN);
        }

        if (amount > account1.getBalance()) {
            return new ResponseEntity<>("You don't have request amount", HttpStatus.FORBIDDEN);
        }

        transactionService.saveTransaction(new Transaction(TransactionType.DEBIT,-amount,description, LocalDateTime.now(),account1));
        transactionService.saveTransaction(new Transaction(TransactionType.CREDIT,amount,description, LocalDateTime.now(),account2));
        account1.setBalance(account1.getBalance()-amount);
        accountService.saveAccount(account1);
        account2.setBalance(account2.getBalance()+amount);
        accountService.saveAccount(account2);

        return new ResponseEntity<>("Transaction created", HttpStatus.CREATED);
    }
}
