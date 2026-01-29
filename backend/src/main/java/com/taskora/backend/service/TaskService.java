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

    // ✅ Get Tasks of User
    public List<Task> getTasksByEmail(String email) {
        return repo.findByUserEmail(email);
    }

    // ✅ Create Task
    public Task createTask(Task task) {
        return repo.save(task);
    }

    // ✅ Mark Done
    public Task completeTask(Long id) {
        Task t = repo.findById(id).orElseThrow();
        t.setDone(true);
        return repo.save(t);
    }

    // ✅ Toggle Pin
    public Task togglePin(Long id) {
        Task t = repo.findById(id).orElseThrow();
        t.setPinned(!t.isPinned());
        return repo.save(t);
    }

    // ✅ Delete
    public void deleteTask(Long id) {
        repo.deleteById(id);
    }
}
