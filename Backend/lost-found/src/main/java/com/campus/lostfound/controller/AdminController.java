package com.campus.lostfound.controller;

import com.campus.lostfound.model.Item;
import com.campus.lostfound.model.ItemStatus;
import com.campus.lostfound.model.User;
import com.campus.lostfound.repository.ItemRepository;
import com.campus.lostfound.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminController {

    private final ItemRepository itemRepository;
    private final UserRepository userRepository;

    public AdminController(
            ItemRepository itemRepository,
            UserRepository userRepository
    ) {
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/items")
    public ResponseEntity<List<Item>> getAllItems() {

        return ResponseEntity.ok(
                itemRepository.findAll()
        );
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<?> removeItem(
            @PathVariable Long id
    ) {

        Item item = itemRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Item not found"
                        )
                );

        item.setStatus(ItemStatus.REMOVED);

        itemRepository.save(item);

        return ResponseEntity.ok(
                "Item removed successfully"
        );
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsers() {

        return ResponseEntity.ok(
                userRepository.findAll()
        );
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(
            @PathVariable Long id
    ) {

        userRepository.deleteById(id);

        return ResponseEntity.ok(
                "User deleted successfully"
        );
    }

    @GetMapping("/statistics")
    public ResponseEntity<?> statistics() {

        long totalUsers =
                userRepository.count();

        long totalItems =
                itemRepository.count();

        long openItems =
                itemRepository
                        .findByStatus(ItemStatus.OPEN)
                        .size();

        long returnedItems =
                itemRepository
                        .findByStatus(ItemStatus.RETURNED)
                        .size();

        Map<String, Long> statistics =
                new HashMap<>();

        statistics.put(
                "totalUsers",
                totalUsers
        );

        statistics.put(
                "totalItems",
                totalItems
        );

        statistics.put(
                "openItems",
                openItems
        );

        statistics.put(
                "returnedItems",
                returnedItems
        );

        return ResponseEntity.ok(
                statistics
        );
    }
}