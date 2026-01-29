package com.taskora.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    // ✅ UI Group: Today / Tomorrow / This Week
    private String groupName;

    // ✅ Due text shown in UI
    private String due;

    // ✅ High / Medium / Low
    private String priority;

    private boolean pinned;

    private boolean done;

    // ✅ Task belongs to logged user
    private String userEmail;
}
