package com.mindhub.homebanking.controllers;

import com.mindhub.homebanking.dtos.AccountDTO;
import com.mindhub.homebanking.models.Account;
import com.mindhub.homebanking.models.AccountType;
import com.mindhub.homebanking.models.Client;
import com.mindhub.homebanking.services.AccountService;
import com.mindhub.homebanking.services.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class AccountController {

    @Autowired
    ClientService clientService;

    @Autowired
    AccountService accountService;

    @GetMapping("/accounts")
    public List<AccountDTO> getAccounts() {
        return accountService.getAccounts();
    }

    @GetMapping("accounts/{id}")
    public AccountDTO getAccount(@PathVariable Long id) {
        return accountService.findAccountById(id);
    }

    @PostMapping("/clients/current/accounts")
    public ResponseEntity<Object> createAccount(Authentication authentication, @RequestParam AccountType type) {

        Client client = clientService.findClientByEmail(authentication.getName());

        if (client.getAccounts().size() > 2 && client.getAccounts().stream().filter(e -> e.getDeleted() == false).count() > 2)
            return new ResponseEntity<>("Already have 3 accounts", HttpStatus.FORBIDDEN);


        Random num = new Random();
        int n = num.nextInt(99999999 - 1 + 1) + 1;

        accountService.saveAccount(new Account("VIN" + n, LocalDateTime.now(), 0.00, type, false, client));

        return new ResponseEntity<>("Account created", HttpStatus.CREATED);
    }

    @PatchMapping("/clients/current/accounts/{id}")
    public ResponseEntity<Object> patchAccount(@PathVariable Long id, @RequestParam Boolean statusHide) {
        Account account = accountService.findById(id);

        account.setDeleted(statusHide);

        accountService.saveAccount(account);

        return new ResponseEntity<>("Modified successfully!", HttpStatus.OK);
    }

    @GetMapping("/clients/current/accounts")
    public List<AccountDTO> getAccounts(Authentication authentication) {
        Client client = clientService.findClientByEmail(authentication.getName());
        return client.getAccounts().stream().map(AccountDTO::new).collect(Collectors.toList());
    }
}
