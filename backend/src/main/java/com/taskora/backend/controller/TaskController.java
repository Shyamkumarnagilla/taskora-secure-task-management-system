package com.taskora.backend.controller;

import com.taskora.backend.entity.Task;
import com.taskora.backend.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TaskController {

    private final TaskService service;

    // ✅ Load Tasks for User
    @GetMapping("/{email}")
    public List<Task> getTasks(@PathVariable String email) {
        return service.getTasksByEmail(email);
    }

    // ✅ Create Task
    @PostMapping
    public Task createTask(@RequestBody Task task) {
        return service.createTask(task);
    }

    // ✅ Complete Task
    @PutMapping("/{id}/complete")
    public Task completeTask(@PathVariable Long id) {
        return service.completeTask(id);
    }

    // ✅ Pin Task
    @PutMapping("/{id}/pin")
    public Task pinTask(@PathVariable Long id) {
        return service.togglePin(id);
    }

    // ✅ Delete Task
    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        service.deleteTask(id);
    }
}
