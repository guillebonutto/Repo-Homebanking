package com.mindhub.homebanking.utils;

public final class CardUtils {

    private CardUtils() {
    }

    public static int getCvvNumber() {
        int cvvNumber = (int) Math.round(Math.random() * (999-111)+111);
        return cvvNumber;
    }

    public static String getCardNumber() {
        String cardNumber = Math.round(Math.random() * (5299-4199)+4199)+"-"+Math.round(Math.random() * (9999-1111)+1111)+"-"+Math.round(Math.random() * (9999-1111)+1111)+"-"+Math.round(Math.random() * (9999-1111)+1111);
        return cardNumber;
    }

}
