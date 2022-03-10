package com.mindhub.homebanking.controllers;


import com.mindhub.homebanking.dtos.LoanApplicationDTO;
import com.mindhub.homebanking.dtos.LoanDTO;
import com.mindhub.homebanking.models.*;
import com.mindhub.homebanking.services.*;
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
public class LoanController {

    @Autowired
    ClientService clientService;

    @Autowired
    AccountService accountService;

    @Autowired
    TransactionService transactionService;

    @Autowired
    LoanService loanService;

    @Autowired
    ClientLoanService clientLoanService;

    @GetMapping("/loans")
    public List<LoanDTO> getLoans() {
        return loanService.getLoans();
    }

    @Transactional
    @PostMapping("/loans")
    public ResponseEntity<Object> requestLoans(Authentication authentication, @RequestBody LoanApplicationDTO loanApplicationDTO) {
        Client client = clientService.findClientByEmail(authentication.getName());
        Account account = accountService.findByNumber(loanApplicationDTO.getAccount());
        Loan loan = loanService.findByName(loanApplicationDTO.getName());

        if (loanApplicationDTO.getName().isEmpty() || loanApplicationDTO.getAmount().toString().isEmpty() || loanApplicationDTO.getDue() == null) {
            if (loanApplicationDTO.getAmount() == 0 || loanApplicationDTO.getDue() == 0) {
                return new ResponseEntity<>("Missing data", HttpStatus.FORBIDDEN);
            }
            return new ResponseEntity<>("Missing data", HttpStatus.FORBIDDEN);
        }

        if (loan == null) {
            return new ResponseEntity<>("Loan does not exist", HttpStatus.FORBIDDEN);
        }

        if (loanApplicationDTO.getAmount() > loan.getMaxAmount()) {
            return new ResponseEntity<>("Requested amount exceeds the maximum loan amount", HttpStatus.FORBIDDEN);
        }

        if (!loan.getDues().contains(loanApplicationDTO.getDue())) {
            return new ResponseEntity<>("Not available", HttpStatus.FORBIDDEN);
        }

        if (!account.getNumber().equals(loanApplicationDTO.getAccount())) {
            return new ResponseEntity<>("Destiny account does not exist", HttpStatus.FORBIDDEN);
        }

        if (!client.getAccounts().contains(account)) {//client.getAccounts().stream().filter(e -> e.getNumber().equals(loanApplicationDTO.getDestinyAccount())).collect(Collectors.toList()) == null) {
            return new ResponseEntity<>("This account does not belong to the client", HttpStatus.FORBIDDEN);
        }

        double percentage = 1. + loan.getPercentage();


        clientLoanService.saveClientLoan(new ClientLoan(loanApplicationDTO.getAmount(), loanApplicationDTO.getDue(), (loanApplicationDTO.getAmount() / loanApplicationDTO.getDue()) * percentage, client, loan));
        transactionService.saveTransaction(new Transaction(TransactionType.CREDIT, loanApplicationDTO.getAmount(), loan.getName() + " loan approved", LocalDateTime.now(), account));
        account.setBalance(account.getBalance() + loanApplicationDTO.getAmount());
        accountService.saveAccount(account);

        return new ResponseEntity<>("Loan requested successfully", HttpStatus.CREATED);
    }

    @PostMapping("/loans/admin")
    public ResponseEntity<Object> createLoans(@RequestBody LoanApplicationDTO loanApplicationDTO) {

        if (loanApplicationDTO.getName().isEmpty() || loanApplicationDTO.getMaxAmount() == 0 || loanApplicationDTO.getDues() == null) {
            return new ResponseEntity<>("Missing data", HttpStatus.FORBIDDEN);
        }
        loanService.saveLoan(new Loan(loanApplicationDTO.getName(), loanApplicationDTO.getMaxAmount(), loanApplicationDTO.getPercentage(), loanApplicationDTO.getDues()));

        return new ResponseEntity<>("Loan created", HttpStatus.CREATED);
    }
}
