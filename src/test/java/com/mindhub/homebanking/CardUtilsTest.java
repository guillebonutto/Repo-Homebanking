package com.mindhub.homebanking;

import com.mindhub.homebanking.repositories.CardRepository;
import com.mindhub.homebanking.utils.CardUtils;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;


import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

@SpringBootTest
public class CardUtilsTest {

    @Test
    public void cardNumberIsCreated(){

        String cardNumber = CardUtils.getCardNumber();

        assertThat(cardNumber,is(not(emptyOrNullString())));

    }

    @Test
    public void cardCvvNumberIsCreated(){

        Integer cardCvvNumber = CardUtils.getCvvNumber();

        assertThat(cardCvvNumber,is(not(String.valueOf(emptyOrNullString()))));

    }
}
