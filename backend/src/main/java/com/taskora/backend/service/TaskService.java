package com.taskora.backend.service;

import com.taskora.backend.entity.Task;
import com.taskora.backend.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository repo;

    public List<Task> getTasksByEmail(String email) {
        return repo.findByUserEmail(email);
    }

    public Task createTask(Task task) {
        return repo.save(task);
    }

    public Task completeTask(Long id) {
        Task t = repo.findById(id).orElseThrow();
        t.setDone(true);
        return repo.save(t);
    }

    public Task togglePin(Long id) {
        Task t = repo.findById(id).orElseThrow();
        t.setPinned(!t.isPinned());
        return repo.save(t);
    }

    public void deleteTask(Long id) {
        repo.deleteById(id);
    }
}
