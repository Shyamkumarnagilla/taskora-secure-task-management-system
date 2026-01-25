package com.taskora.backend.repository;

import com.taskora.backend.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByUserEmail(String userEmail);
}
