package com.mindhub.homebanking.controllers;

import com.mindhub.homebanking.models.*;
import com.mindhub.homebanking.services.AccountService;
import com.mindhub.homebanking.services.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api")
public class BuySellController {

    @Autowired
    AccountService accountService;

    @Autowired
    TransactionService transactionService;

    @PostMapping("/clients/current/accounts/dollars")
    public ResponseEntity<Object> buyDollars(@RequestParam Double amount, @RequestParam String originAccount, @RequestParam String destinyAccount) {

        Account account1 = accountService.findByNumber(originAccount);
        Account account2 = accountService.findByNumber(destinyAccount);

        transactionService.saveTransaction(new Transaction(TransactionType.DEBIT,amount,"successful purchase of dollars", LocalDateTime.now(),account1));
        account1.setBalance(account1.getBalance()-amount);
        accountService.saveAccount(account1);
        transactionService.saveTransaction(new Transaction(TransactionType.CREDIT,amount,"successful purchase of dollars", LocalDateTime.now(),account2));
        account2.setBalance(account2.getBalance()+amount);
        accountService.saveAccount(account2);

        return new ResponseEntity<>("You bought dollars", HttpStatus.OK);
    }

    public ResponseEntity<Object> sellDollars(@RequestParam Double amount, @RequestParam String originAccount, @RequestParam String destinyAccount) {

        Account account1 = accountService.findByNumber(originAccount);
        Account account2 = accountService.findByNumber(destinyAccount);

        transactionService.saveTransaction(new Transaction(TransactionType.DEBIT,-amount,"successful sell of dollars", LocalDateTime.now(),account1));
        account1.setBalance(account1.getBalance()-amount);
        accountService.saveAccount(account1);
        transactionService.saveTransaction(new Transaction(TransactionType.CREDIT,-amount,"successful sell of dollars", LocalDateTime.now(),account2));
        account2.setBalance(account2.getBalance()+amount);
        accountService.saveAccount(account2);

        return new ResponseEntity<>("You selled dollars", HttpStatus.OK);
    }
}
