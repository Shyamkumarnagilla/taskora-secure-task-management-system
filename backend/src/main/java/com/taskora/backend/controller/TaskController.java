package com.taskora.backend.controller;

import com.taskora.backend.dto.TaskRequest;
import com.taskora.backend.entity.Task;
import com.taskora.backend.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
@CrossOrigin("*")
public class TaskController {

    private final TaskService taskService;

    // ✅ Create new task
    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody TaskRequest request) {
        return ResponseEntity.ok(taskService.createTask(request));
    }

    // ✅ Get tasks for a user
    @GetMapping("/{email}")
    public ResponseEntity<List<Task>> getTasks(@PathVariable String email) {
        return ResponseEntity.ok(taskService.getTasksByUser(email));
    }

    // ✅ Complete Task
    @PutMapping("/{id}/complete")
    public ResponseEntity<Task> completeTask(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.completeTask(id));
    }

    // ✅ Update Task Title
    @PutMapping("/{id}/update")
    public ResponseEntity<Task> updateTask(
            @PathVariable Long id,
            @RequestParam String title) {
        return ResponseEntity.ok(taskService.updateTask(id, title));
    }

    // ✅ Delete Task
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok("Task deleted");
    }

}
