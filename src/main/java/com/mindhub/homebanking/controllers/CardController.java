package com.mindhub.homebanking.controllers;

import com.mindhub.homebanking.dtos.CardDTO;
import com.mindhub.homebanking.models.*;
import com.mindhub.homebanking.services.AccountService;
import com.mindhub.homebanking.services.CardService;
import com.mindhub.homebanking.services.ClientService;
import com.mindhub.homebanking.utils.CardUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class CardController {

    @Autowired
    ClientService clientService;

    @Autowired
    AccountService accountService;

    @Autowired
    CardService cardService;

    @GetMapping("/cards")
    public List<CardDTO> getCards() {
        return cardService.getCards();
    }

    @PostMapping("/clients/current/cards")
    public ResponseEntity<Object> createCard(Authentication authentication, @RequestParam CardType type, @RequestParam CardColor color, @RequestParam String account) {

        Client client = clientService.findClientByEmail(authentication.getName());
        Account associatedAccount = accountService.findByNumber(account);

        if (client.getCards().stream().filter(e -> e.getType().toString().equals(type.toString())).count() > 2 && client.getCards().stream().filter(e -> e.getDeleted() == false).count() > 2)
            return new ResponseEntity<>("Already have 3 cards", HttpStatus.FORBIDDEN);

        String cardNumber = CardUtils.getCardNumber();
        int cvvNumber = CardUtils.getCvvNumber();

        cardService.saveCard(new Card(client.getFirstName() + " " + client.getLastName(), type, color, cardNumber, cvvNumber, LocalDate.now().plusYears(5), LocalDate.now(), false, account.toString(), client, associatedAccount));

        return new ResponseEntity<>("Card created", HttpStatus.CREATED);
    }

/*    @DeleteMapping("/clients/current/cards/{id}")
    public ResponseEntity<Object> deleteCard(Authentication authentication, @PathVariable Long id) {

        Client client = clientRepository.findByEmail(authentication.getName());

        if (client.getCards().contains(id)) {
            return new ResponseEntity<>("Incorrect number", HttpStatus.FORBIDDEN);
        }

        cardRepository.deleteById(id);

        return new ResponseEntity<>("Card deleted",HttpStatus.OK);
    }*/

    @PatchMapping("/clients/current/cards/{id}")
    public ResponseEntity<Object> hideCard(@PathVariable Long id, @RequestParam Boolean statusHide) {
        Card card = cardService.findById(id);

        card.setDeleted(statusHide);

        cardService.saveCard(card);

        return new ResponseEntity<>("Deleted successfully", HttpStatus.OK);
    }

/*    @PatchMapping("/clients/current/cards/{id}")
    public  ResponseEntity<Object> disableCard(Authentication authentication, @PathVariable Long id, @RequestParam Boolean statusDefeated) {
        Card card = cardRepository.findById(id).orElse(null);

            card.setDefeated(statusDefeated);

        cardRepository.save(card);

        return new ResponseEntity<>("Modified successfully",HttpStatus.OK);
    }*/

    @GetMapping("/clients/current/cards")
    public List<CardDTO> getCards(Authentication authentication) {
        Client client = clientService.findClientByEmail(authentication.getName());
        return client.getCards().stream().map(CardDTO::new).collect(Collectors.toList());
    }
}
