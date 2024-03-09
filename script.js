const ELEVATORS = [
  {
    id: "elevator-dn",
    actions: [],
  },
  {
    id: "elevator",
    actions: [],
  },
];

const closeDoors = (elevatorId) => {
  const doors = document.querySelector(`#${elevatorId} .doors`);
  doors.childNodes.forEach((door) => {
    if (door.nodeType === 1) {
      door.classList.add("animate-door-close");
      door.classList.remove("animate-door-open");
    }
  });
};

const openDoors = (elevatorId) => {
  const doors = document.querySelector(`#${elevatorId} .doors`);
  doors.childNodes.forEach((door) => {
    if (door.nodeType === 1) {
      door.classList.remove("animate-door-close");
      door.classList.add("animate-door-open");
    }
  });
};

const getClosestElevator = (floorNum = 0) => {
  let elev = ELEVATORS[0];

  // find distance
  ELEVATORS.forEach((elevator) => {
    let distance =
      parseInt(floorNum) -
      parseInt(document.getElementById(elevator.id).dataset.floor);
    if (distance < 0) distance *= -1;

    elevator.distance = distance;
    // if (elevator.actions.length === 0) {
    //     elev = elevator;
    // }

    // listen for animation-end event to open doors on resting elevator
    const doors = document.querySelector(`#${elevator.id} .doors`);
    const animationDuration = getComputedStyle(document.body).getPropertyValue(
      "--animation-duration"
    );

    doors.childNodes.forEach((door) => {
      // 1400ms delay hotfix
      const animationDelay = parseInt(
        1400 + parseFloat(animationDuration.replace("s", "")) * 1000
      );
      if (door.nodeType === 1) {
        door.addEventListener("animationend", () => {
          setTimeout(() => {
            openDoors(door.parentElement.parentElement.parentElement.id);
          }, animationDelay);
        });
      }
    });
  });

  // find nearest elevator
  for (let i = 1; i < ELEVATORS.length; i++) {
    if (ELEVATORS[i].distance < elev.distance) {
      elev = ELEVATORS[i];
    }
  }

  return elev;
};

const moveElevatorToFloor = (elevatorId, floorNum) => {
  const totalFloors = getComputedStyle(document.body).getPropertyValue(
    "--num-floors"
  );
  const mul =
    elevatorId == "elevator-dn" ? parseInt(totalFloors - floorNum) : -floorNum;

  console.log(`translateY(calc(111% * ${mul}))`);
  document.querySelector(
    `.parent > #${elevatorId} .cab`
  ).style.transform = `translateY(calc(111% * ${mul}))`;
  document.getElementById(elevatorId).dataset.floor = `${floorNum}`;

  // animate door close
  closeDoors(elevatorId);
};

document.querySelectorAll(".btn-up").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const stepsTaken = e.target.dataset?.floor;
    const elevator = getClosestElevator(stepsTaken);

    if (elevator !== null && stepsTaken) {
      console.log("here");
      moveElevatorToFloor(elevator.id, stepsTaken);
    }
  });
});

document.querySelectorAll(".btn-down").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    console.log("Down Button pressed on Floor: ", e.target.dataset?.floor);
    const stepsTaken = e.target.dataset?.floor;
    const elevator = getClosestElevator(stepsTaken);

    if (elevator !== null && stepsTaken) {
      console.log("here");
      moveElevatorToFloor(elevator.id, stepsTaken);
    }
  });
});
