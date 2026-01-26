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

    // ✅ Mark Task Completed
    public Task completeTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setCompleted(true);
        return taskRepository.save(task);
    }

    // ✅ Update Task Title
    public Task updateTask(Long id, String newTitle) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setTitle(newTitle);
        return taskRepository.save(task);
    }

    // ✅ Delete Task
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    public List<Task> getTasksByUser(String email) {
        return taskRepository.findByUserEmail(email);
    }
}
