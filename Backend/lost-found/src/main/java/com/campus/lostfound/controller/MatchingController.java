package com.campus.lostfound.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.campus.lostfound.service.MatchingService;
import com.campus.lostfound.service.MatchingService.MatchResult;

@RestController
@RequestMapping("/api/matches")
@CrossOrigin
public class MatchingController {

    private final MatchingService matchingService;

    public MatchingController(MatchingService matchingService) {
        this.matchingService = matchingService;
    }

    @GetMapping("/{lostItemId}")
    public ResponseEntity<List<MatchResult>> findMatches(
            @PathVariable long lostItemId
    ) {
        return ResponseEntity.ok(
                matchingService.findMatches(lostItemId)
        );
    }
}