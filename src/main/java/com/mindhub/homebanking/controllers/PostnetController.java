package com.mindhub.homebanking.controllers;

import com.mindhub.homebanking.dtos.PostnetApplicationDTO;
import com.mindhub.homebanking.models.*;
import com.mindhub.homebanking.services.AccountService;
import com.mindhub.homebanking.services.CardService;
import com.mindhub.homebanking.services.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api")
public class PostnetController {

    @Autowired
    AccountService accountService;

    @Autowired
    CardService cardService;

    @Autowired
    TransactionService transactionService;

    @PostMapping("/postnet")
    public ResponseEntity<Object> createLoans(Authentication authentication, @RequestBody PostnetApplicationDTO postnetApplicationDTO) {

        Card card = cardService.findByNumber(postnetApplicationDTO.getCardNumber());
        Account account = accountService.findByNumber(card.getAccount().getNumber());
        Account account1 = accountService.findByNumber(postnetApplicationDTO.getDestiny());

        if (postnetApplicationDTO.getCardNumber().isEmpty() || postnetApplicationDTO.getAmount() == 0 || postnetApplicationDTO.getCvv() == 0 || postnetApplicationDTO.getDestiny().isEmpty()) {
            return new ResponseEntity<>("Missing data", HttpStatus.FORBIDDEN);
        }

        if (postnetApplicationDTO.getDestiny() == null) {
            return new ResponseEntity<>("Destiny account does not exist", HttpStatus.FORBIDDEN);
        }

        if (postnetApplicationDTO.getAmount() > account.getBalance()) {
            return new ResponseEntity<>("Requested amount exceeds the maximum account amount", HttpStatus.FORBIDDEN);
        }

        if (account.getDeleted()) {
            return new ResponseEntity<>("Deleted account", HttpStatus.FORBIDDEN);
        }

        if (account1.getDeleted()) {
            return new ResponseEntity<>("Deleted account", HttpStatus.FORBIDDEN);
        }

        if (card.getDeleted()) {
            return new ResponseEntity<>("Deleted card", HttpStatus.FORBIDDEN);
        }

        if (LocalDate.now().isAfter(card.getThruDate())) {
            return new ResponseEntity<>("Expired card", HttpStatus.FORBIDDEN);
        }

        if (postnetApplicationDTO.getCvv() != card.getCvv()) {
            return new ResponseEntity<>("Cvv does not belong to the card", HttpStatus.FORBIDDEN);
        }

        transactionService.saveTransaction(new Transaction(TransactionType.DEBIT, -postnetApplicationDTO.getAmount(), postnetApplicationDTO.getDescription(), LocalDateTime.now(), account));
        transactionService.saveTransaction(new Transaction(TransactionType.CREDIT, postnetApplicationDTO.getAmount(), postnetApplicationDTO.getDescription(), LocalDateTime.now(), account1));
        account.setBalance(account.getBalance() - postnetApplicationDTO.getAmount());
        account1.setBalance(account1.getBalance() + postnetApplicationDTO.getAmount());
        accountService.saveAccount(account);
        accountService.saveAccount(account1);

        return new ResponseEntity<>("Success purchase", HttpStatus.CREATED);

    }
}
