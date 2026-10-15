package com.campus.lostfound.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;

import com.campus.lostfound.model.Item;
import com.campus.lostfound.model.ItemStatus;
import com.campus.lostfound.model.ItemType;
import com.campus.lostfound.repository.ItemRepository;

@Service
public class MatchingService {

    private final ItemRepository itemRepository;

    public MatchingService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    public List<MatchResult> findMatches(long lostItemId) {

    Item lostItem = itemRepository
            .findById(lostItemId)
            .orElseThrow(() ->
                    new RuntimeException(
                            "Lost item not found"
                    )
            );

    if (lostItem.getType() != ItemType.LOST) {
        throw new RuntimeException(
                "Matching is only available for LOST items"
        );
    }

    List<Item> foundItems =
            itemRepository.findByTypeAndStatus(
                    ItemType.FOUND,
                    ItemStatus.OPEN
            );

    // continue with the rest of your existing code

        List<MatchResult> results = new ArrayList<>();

        for (Item foundItem : foundItems) {

            int score = calculateScore(
                    lostItem,
                    foundItem
            );

            if (score > 0) {

                results.add(
                        new MatchResult(
                                foundItem,
                                score
                        )
                );
            }
        }

        results.sort(
    Comparator.comparingInt(
        (MatchResult result) -> result.getScore()
    ).reversed()
);

        return results;
    }

    private int calculateScore(
            Item lost,
            Item found
    ) {

        int score = 0;

        if (lost.getCategory() != null &&
                found.getCategory() != null &&
                lost.getCategory()
                        .equalsIgnoreCase(
                                found.getCategory()
                        )) {

            score += 40;
        }

        if (lost.getLocation() != null &&
                found.getLocation() != null &&
                lost.getLocation()
                        .equalsIgnoreCase(
                                found.getLocation()
                        )) {

            score += 30;
        }

        if (lost.getKeywords() != null &&
                found.getKeywords() != null) {

            String[] lostKeywords =
                    lost.getKeywords()
                            .toLowerCase()
                            .split(",");

            String foundKeywords =
                    found.getKeywords()
                            .toLowerCase();

            for (String keyword : lostKeywords) {

                if (foundKeywords.contains(
                        keyword.trim()
                )) {

                    score += 10;
                }
            }

            if (score > 100) {
                score = 100;
            }
        }

        return score;
    }

    public static class MatchResult {

        private final Item item;
        private final int score;

        public MatchResult(
                Item item,
                int score
        ) {
            this.item = item;
            this.score = score;
        }

        public Item getItem() {
            return item;
        }

        public int getScore() {
            return score;
        }
    }
}