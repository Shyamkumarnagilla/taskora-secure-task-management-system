package com.taskora.backend.service;

import com.taskora.backend.dto.TaskRequest;
import com.taskora.backend.entity.Task;
import com.taskora.backend.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;

    public Task createTask(TaskRequest request) {

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .userEmail(request.getUserEmail())
                .completed(false)
                .build();

        return taskRepository.save(task);
    }

    public List<Task> getTasksByUser(String email) {
        return taskRepository.findByUserEmail(email);
    }
}
