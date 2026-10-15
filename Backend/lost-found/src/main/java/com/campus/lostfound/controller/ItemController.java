package com.campus.lostfound.controller;

import com.campus.lostfound.dto.ItemRequest;
import com.campus.lostfound.model.Item;
import com.campus.lostfound.service.ItemService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
@CrossOrigin
public class ItemController {

    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @PostMapping
    public ResponseEntity<Item> createItem(
            @Valid @RequestBody ItemRequest request,
            Authentication authentication
    ) {

        String email = authentication.getName();

        Item item = itemService.createItem(
                request,
                email
        );

        return ResponseEntity.ok(item);
    }

    @GetMapping
    public ResponseEntity<List<Item>> getItems() {

        return ResponseEntity.ok(
                itemService.getAllOpenItems()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Item> getItem(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                itemService.getItem(id)
        );
    }

    @GetMapping("/search")
    public ResponseEntity<List<Item>> search(
            @RequestParam String keyword
    ) {

        return ResponseEntity.ok(
                itemService.search(keyword)
        );
    }

    @PutMapping("/{id}/returned")
    public ResponseEntity<Item> markReturned(
            @PathVariable Long id,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                itemService.markReturned(
                        id,
                        authentication.getName()
                )
        );
    }
}