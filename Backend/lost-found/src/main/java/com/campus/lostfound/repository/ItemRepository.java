package com.campus.lostfound.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campus.lostfound.model.Item;
import com.campus.lostfound.model.ItemStatus;
import com.campus.lostfound.model.ItemType;

public interface ItemRepository extends JpaRepository<Item, Long> {

    List<Item> findByStatus(ItemStatus status);

    List<Item> findByTypeAndStatus(
            ItemType type,
            ItemStatus status
    );

    List<Item> findByCategoryIgnoreCase(String category);

    List<Item> findByLocationIgnoreCase(String location);

    List<Item> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            String title,
            String description
    );

    List<Item> findByTitleContainingIgnoreCaseAndStatusOrDescriptionContainingIgnoreCaseAndStatus(
            String title,
            ItemStatus titleStatus,
            String description,
            ItemStatus descriptionStatus
    );
}