package com.mindhub.homebanking.services;

import com.mindhub.homebanking.dtos.ClientDTO;
import com.mindhub.homebanking.models.Client;

import java.util.List;

public interface ClientService {
    public List<ClientDTO> getClients();
    public Client saveClient(Client client);
    public ClientDTO findByEmail(String email);
    public Client findClientByEmail(String email);
}
