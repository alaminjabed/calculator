const calcCont = document.querySelector(".calculator");
  const $input = document.querySelector("#calcinput");
  const numKeys = document.querySelectorAll(".num");
  const opClear = document.querySelector(".op[op=clear]");
  const opEquals = document.querySelector(".eq");
  const opMulti = document.querySelector(".op[op=Multiply]");
  const regEx = /[0-9 .]/;
  const buffer = [];
  const operator = [
    "Add",
    "Subtract",
    "Multiply",
    "Divide",
    "Percent",
    "Negate",
  ];

  const opCallback = (opName) => {
    if ($input.value === "") return;

    let currentVal = parseFloat($input.value);

    if (opName === "Percent") return ($input.value = currentVal / 100);
    if (opName === "Negate") return ($input.value = -parseFloat(currentVal));

    if (buffer.length === 2) {
      buffer.push({ value: currentVal });
      currentVal = evaluate(buffer);
    }

    buffer.push({ value: currentVal });
    buffer.push({ value: opName });
    $input.placeholder = currentVal + " " + opName;
    $input.value = "";
  };

  const evaluate = (buffer) => {
    const secondOperand = buffer.pop().value;
    const operator = buffer.pop().value;
    const firstOperand = buffer.pop().value;

    switch (operator) {
      case "Add":
        return firstOperand + secondOperand;
        break;
      case "Subtract":
        return firstOperand - secondOperand;
        break;
      case "Multiply":
        return firstOperand * secondOperand;
        break;
      case "Divide":
        return firstOperand / secondOperand;
        break;
      default:
        return secondOperand;
    }
  };

  opEquals.onclick = () => {
    if (buffer.length === 2 && $input.value) {
      buffer.push({ value: parseFloat($input.value) });
      $input.value = evaluate(buffer);
    }
  };

  opClear.onclick = () => {
    $input.value = 0;
    buffer.length = 0;
  };

  numKeys.forEach((key) => {
    key.onclick = () =>
      ($input.value =
        $input.value !== "0" ? $input.value + key.innerText : key.innerText);
  });

  operator.forEach((opName) => {
    document.querySelector(`.op[op=${opName}]`).onclick = () =>
      opCallback(opName);
  });

  // Keyboard input
  const clickActive = (keyVal) => {
    keyVal.classList.add("active");
    setTimeout(() => {
      keyVal.classList.remove("active");
    }, 100);
    keyVal.click();
  };

  calcCont.onkeydown = (keyPress) => {
    numKeys.forEach((num) => {
      if (keyPress.key == num.innerText) clickActive(num);
    });

    operator.forEach((opName) => {
      let opEle = document.querySelector(`.op[op=${opName}]`);
      if (keyPress.key == opEle.innerText) clickActive(opEle);
    });

    switch (keyPress.key) {
      case "Delete":
        clickActive(opClear);
        break;
      case "Enter":
      case "=":
        keyPress.preventDefault();
        clickActive(opEquals);
        break;
      case "*":
        keyPress.preventDefault();
        clickActive(opMulti);
        break;
      case "Backspace":
        keyPress.preventDefault();
        $input.value = $input.value.slice(0, $input.value.length - 1);
        if ($input.value === "") $input.value = "0";
        break;
      case "Tab":
      case "F5":
      case "F12":
        break;
      default:
        keyPress.preventDefault();
        break;
    }
  };