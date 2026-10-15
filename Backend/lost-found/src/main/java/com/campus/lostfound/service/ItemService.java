package com.campus.lostfound.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.campus.lostfound.dto.ItemRequest;
import com.campus.lostfound.model.Item;
import com.campus.lostfound.model.ItemStatus;
import com.campus.lostfound.model.User;
import com.campus.lostfound.repository.ItemRepository;
import com.campus.lostfound.repository.UserRepository;

@Service
public class ItemService {

    private final ItemRepository itemRepository;
    private final UserRepository userRepository;

    public ItemService(
            ItemRepository itemRepository,
            UserRepository userRepository
    ) {
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
    }

    public Item createItem(
            ItemRequest request,
            String email
    ) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        Item item = new Item();

        item.setTitle(request.getTitle());
        item.setDescription(request.getDescription());
        item.setCategory(request.getCategory());
        item.setLocation(request.getLocation());
        item.setKeywords(request.getKeywords());
        item.setType(request.getType());
        item.setStatus(ItemStatus.OPEN);
        item.setPostedBy(user);

        return itemRepository.save(item);
    }

    public List<Item> getAllOpenItems() {

        return itemRepository.findByStatus(
                ItemStatus.OPEN
        );
    }

    public Item getItem(long id) {

        return itemRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Item not found"
                        )
                );
    }

    public Item markReturned(
            long id,
            String email
    ) {

        Item item = getItem(id);

        if (!item.getPostedBy()
                .getEmail()
                .equals(email)) {

            throw new RuntimeException(
                    "You can only update your own item"
            );
        }

        item.setStatus(ItemStatus.RETURNED);

        return itemRepository.save(item);
    }

    public List<Item> search(String keyword) {

    return itemRepository
            .findByTitleContainingIgnoreCaseAndStatusOrDescriptionContainingIgnoreCaseAndStatus(
                    keyword,
                    ItemStatus.OPEN,
                    keyword,
                    ItemStatus.OPEN
            );
}
}