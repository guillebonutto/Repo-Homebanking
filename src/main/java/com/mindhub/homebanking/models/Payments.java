package com.mindhub.homebanking.models;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

public class Payments {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private long id;

    private int payment;

    public Payments() {
    }

    public Payments(long idLoan, int cuota) {
        this.payment = payment;
    }

    public long getId() {
        return id;
    }

    public int getPayment() {
        return payment;
    }

    public void setPayment(int cuota) {
        this.payment = payment;
    }
}
