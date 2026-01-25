package com.taskora.backend.service;

import com.taskora.backend.entity.Task;
import com.taskora.backend.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;

    // ✅ Create Task
    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    // ✅ Get Tasks by User Email
    public List<Task> getTasksByUser(String email) {
        return taskRepository.findByUserEmail(email);
    }
}
