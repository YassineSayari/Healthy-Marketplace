package tn.esprit.orderservice.controllers;



import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.orderservice.entities.Order;
import tn.esprit.orderservice.entities.Payment;
import tn.esprit.orderservice.services.OrderService;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<Order> getAll() {
        return orderService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOne(@PathVariable Long id) {
        return orderService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public List<Order> getByUser(@PathVariable String userId) {
        return orderService.findByUserId(userId);
    }

    @PostMapping
    public Order create(@RequestBody Order order) {
        return orderService.save(order);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Order> update(@PathVariable Long id, @RequestBody Order incomingOrder) {
        return orderService.findById(id)
                .map(existing -> {
                    // Update simple fields on Order
                    existing.setUserId(incomingOrder.getUserId());
                    existing.setTotalPrice(incomingOrder.getTotalPrice());
                    existing.setStatus(incomingOrder.getStatus());
                    // Do NOT update createdAt

                    // Handle Payment safely - NEVER just set a new object
                    if (incomingOrder.getPayment() != null) {
                        Payment incomingPayment = incomingOrder.getPayment();

                        if (existing.getPayment() == null) {
                            // First time adding payment
                            Payment newPayment = new Payment();
                            newPayment.setOrder(existing);
                            existing.setPayment(newPayment);
                        }

                        Payment paymentToUpdate = existing.getPayment();

                        paymentToUpdate.setAmount(incomingPayment.getAmount());
                        paymentToUpdate.setMethod(incomingPayment.getMethod());
                        paymentToUpdate.setPaymentStatus(incomingPayment.getPaymentStatus());
                        if (incomingPayment.getPaymentDate() != null) {
                            paymentToUpdate.setPaymentDate(incomingPayment.getPaymentDate());
                        }
                    }

                    return ResponseEntity.ok(orderService.save(existing));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (orderService.findById(id).isPresent()) {
            orderService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
