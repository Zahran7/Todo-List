const weeklyKeys = {
    saturday: "saturdayTasks",
    sunday: "sundayTasks",
    monday: "mondayTasks",
    tuesday: "tuesdayTasks",
    wednesday: "wednesdayTasks",
    thursday: "thursdayTasks",
    friday: "fridayTasks",
  };

  const dailyView = document.getElementById("daily-view");
  const weeklyView = document.getElementById("weekly-view");
  const dailyBtn = document.getElementById("daily-btn");
  const weeklyBtn = document.getElementById("weekly-btn");
  const dailyTaskInput = document.getElementById("daily-task-input");
  const dailyTaskList = document.getElementById("daily-task-list");
  

  dailyBtn.addEventListener("click", () => toggleView("daily"));
  weeklyBtn.addEventListener("click", () => toggleView("weekly"));
  
  function toggleView(view) {
    if (view === "daily") {
      dailyView.classList.remove("hidden");
      weeklyView.classList.add("hidden");
      dailyBtn.classList.add("active");
      weeklyBtn.classList.remove("active");
    } else {
      weeklyView.classList.remove("hidden");
      dailyView.classList.add("hidden");
      weeklyBtn.classList.add("active");
      dailyBtn.classList.remove("active");
    }
  }
  

  function createTaskElement(taskText, taskList, dayKey, completed = false) {
    const taskItem = document.createElement("li");
    taskItem.className = "task-item";
    if (completed) taskItem.classList.add("completed");
  
    taskItem.innerHTML = `
      <div class="d-flex justify-content-between align-items-center w-100">
      <div class="d-flex justify-content-between group w-100">
        <input type="checkbox" class="task-checkbox" ${completed ? "checked" : ""}>
        <input type="text" class="task-input form-control" value="${taskText}" ${completed ? "disabled" : "disabled"}>
        <div>
        </div>
        <div class="bttns">
          <button class="update-btn btn btn-info btn-sm">✏️</button>
          <button class="delete-btn btn btn-danger btn-sm">&times;</button>
          </div>
        </div>
      </div>
    `;
  
    const input = taskItem.querySelector(".task-input");
    const checkbox = taskItem.querySelector(".task-checkbox");
    const updateBtn = taskItem.querySelector(".update-btn");
    const deleteBtn = taskItem.querySelector(".delete-btn");
  
  
    checkbox.addEventListener("change", () => {
      taskItem.classList.toggle("completed");
      saveTasks(dayKey, taskList);  
    });

    updateBtn.addEventListener("click", () => {
      if (input.disabled) {
        input.disabled = false; 
        input.classList.add("bgg");  
        updateBtn.textContent = "Save";  
        updateBtn.classList.add("btn-success"); 
        updateBtn.classList.remove("btn-info");  
        input.focus();  
      } else {
        input.disabled = true;  
        updateBtn.textContent = "✏️"; 
        updateBtn.classList.add("btn-info");  
        updateBtn.classList.remove("btn-success");  
        saveTasks(dayKey, taskList); 
      }
    });
  
   
    deleteBtn.addEventListener("click", () => {
      taskItem.remove();
      saveTasks(dayKey, taskList); 
    });
  
    taskList.appendChild(taskItem);
    saveTasks(dayKey, taskList);
  }
  
 
  function saveTasks(dayKey, taskList) {
    const tasks = [];
    taskList.querySelectorAll(".task-item").forEach((item) => {
      const input = item.querySelector(".task-input");
      const taskText = input.value;
      const completed = item.classList.contains("completed");
      tasks.push({ text: taskText, completed: completed });
    });
    localStorage.setItem(dayKey, JSON.stringify(tasks));
  }
  

  function loadTasks(dayKey, taskList) {
    const tasks = JSON.parse(localStorage.getItem(dayKey)) || [];
    tasks.forEach((task) => createTaskElement(task.text, taskList, dayKey, task.completed));
  }
  
 
  document.querySelectorAll(".add-weekly-btn").forEach((btn) => {
    const day = btn.dataset.day;
    const input = document.getElementById(`${day}-input`);
    const taskList = document.getElementById(`${day}-task-list`);
    loadTasks(weeklyKeys[day], taskList);
  
    btn.addEventListener("click", () => {
      const taskText = input.value.trim();
      if (taskText) {
        createTaskElement(taskText, taskList, weeklyKeys[day]);
        input.value = "";
      }
    });
  });
  

  document.getElementById("add-daily-btn").addEventListener("click", () => {
    const taskText = dailyTaskInput.value.trim();
    if (taskText) {
      createTaskElement(taskText, dailyTaskList, "dailyTasks");
      dailyTaskInput.value = "";
    }
  });
  
  
  loadTasks("dailyTasks", dailyTaskList);
  