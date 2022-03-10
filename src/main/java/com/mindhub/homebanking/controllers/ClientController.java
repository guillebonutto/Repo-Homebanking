package com.mindhub.homebanking.controllers;

import com.mindhub.homebanking.dtos.ClientDTO;
import com.mindhub.homebanking.models.Account;
import com.mindhub.homebanking.models.AccountType;
import com.mindhub.homebanking.models.Client;
import com.mindhub.homebanking.services.AccountService;
import com.mindhub.homebanking.services.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/api")
public class ClientController {

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    ClientService clientService;

    @Autowired
    AccountService accountService;

    @GetMapping("/clients")
    public List<ClientDTO> getClients() {
        return clientService.getClients();
    }

/*    @RequestMapping("clients/{id}")
    public ClientDTO getClient(@PathVariable Long id){
        ClientDTO client = new ClientDTO(clientRepository.findById(id).orElse(null));
        return client;
    }*/

    @PostMapping("/clients")
    public ResponseEntity<Object> register(@RequestParam String photo, @RequestParam String firstName, @RequestParam String lastName,
                                           @RequestParam String email, @RequestParam String password) {

        if (firstName.isEmpty() || lastName.isEmpty() || email.isEmpty() || password.isEmpty()) {
            return new ResponseEntity<>("Missing data", HttpStatus.FORBIDDEN);
        }

        if (clientService.findClientByEmail(email) != null) {
            return new ResponseEntity<>("Name already in use", HttpStatus.FORBIDDEN);
        }

        Random num = new Random();
        int n = num.nextInt(99999999-1+1)+1;

        Client client1 = new Client(photo, firstName, lastName, email, passwordEncoder.encode(password));
        Account account1 = new Account("VIN-" + n, LocalDateTime.now(), 0.00, AccountType.SAVING_ACCOUNT,false, client1);

        clientService.saveClient(client1);
        accountService.saveAccount(account1);

        return new ResponseEntity<>("Client registered", HttpStatus.CREATED);
    }

    @GetMapping("/clients/current")
    public ClientDTO getClients(Authentication authentication) {
        return clientService.findByEmail(authentication.getName());
    }
}

