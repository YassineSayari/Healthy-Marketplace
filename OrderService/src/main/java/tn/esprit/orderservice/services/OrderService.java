package tn.esprit.orderservice.services;



import org.springframework.stereotype.Service;
import tn.esprit.orderservice.entities.Order;
import tn.esprit.orderservice.repositories.OrderRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import tn.esprit.orderservice.entities.Order;
import tn.esprit.orderservice.entities.Payment;
import tn.esprit.orderservice.repositories.OrderRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<Order> findAll() {
        return orderRepository.findAll();
    }

    public Optional<Order> findById(Long id) {
        return orderRepository.findById(id);
    }

    public List<Order> findByUserId(String userId) {
        return orderRepository.findByUserId(userId);
    }

    public Order save(Order order) {
        if (order.getCreatedAt() == null) {
            order.setCreatedAt(LocalDateTime.now());
        }

        if (order.getPayment() != null) {
            order.getPayment().setOrder(order);
            if (order.getPayment().getPaymentDate() == null) {
                order.getPayment().setPaymentDate(LocalDateTime.now());
            }
        }

        return orderRepository.save(order);
    }

    public void deleteById(Long id) {
        orderRepository.deleteById(id);
    }
}