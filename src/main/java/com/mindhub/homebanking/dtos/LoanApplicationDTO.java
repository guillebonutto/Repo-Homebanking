package com.mindhub.homebanking.dtos;


import java.util.ArrayList;
import java.util.List;

public class LoanApplicationDTO {

    private String name;
    private String account;
    private Double amount;
    private double maxAmount;
    private int percentage;
    private Integer due;


    private List<Integer> dues = new ArrayList<>();

    public LoanApplicationDTO() {
    }

    public LoanApplicationDTO(String name, String account, Double amount, double maxAmount, int percentage, Integer due, List<Integer> dues) {
        this.name = name;
        this.account = account;
        this.amount = amount;
        this.maxAmount = maxAmount;
        this.percentage = percentage;
        this.due = due;
        this.dues = dues;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAccount() {
        return account;
    }

    public void setAccount(String account) {
        this.account = account;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public double getMaxAmount() {
        return maxAmount;
    }

    public void setMaxAmount(double maxAmount) {
        this.maxAmount = maxAmount;
    }

    public int getPercentage() {
        return percentage;
    }

    public void setPercentage(int percentage) {
        this.percentage = percentage;
    }

    public Integer getDue() {
        return due;
    }

    public void setDue(Integer payment) {
        this.due = payment;
    }

    public List<Integer> getDues() {
        return dues;
    }

    public void setDues(List<Integer> dues) {
        this.dues = dues;
    }
}
