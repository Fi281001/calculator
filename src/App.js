import "./App.css";
import { useState, useEffect, useRef } from "react";

function App() {
  const [value, setValue] = useState("");
  // Xử lý font-size của result khi vượt quá width
  const resultRef = useRef(null);
  useEffect(() => {
    const adjustFontSize = () => {
      const span = resultRef.current;
      if (span) {
        let fontSize = 100; // Kích thước chữ bắt đầu
        span.style.fontSize = `${fontSize}px`;
        // Giảm kích thước chữ cho đến khi nó vừa với chiều rộng của thẻ
        while (span.scrollWidth > span.clientWidth && fontSize > 10) {
          fontSize -= 1;
          span.style.fontSize = `${fontSize}px`;
        }
      }
    };
    adjustFontSize();
    window.addEventListener("resize", adjustFontSize);
    return () => window.removeEventListener("resize", adjustFontSize);
  }, [value]);

  // xử lý tính toán
  const handleEqual = () => {
    try {
      // Loại bỏ các ký tự không hợp lệ và xử lý các số bắt đầu bằng 0
      let sanitizedValue = value
        .replace(/[^0-9+\-*/.]/g, "") // Xóa các ký tự không hợp lệ
        .replace(/(\d+)\s*([\+\-*/])\s*0+(\d+)/g, "$1$2$3"); // Xử lý số octal
      // Kiểm tra xem giá trị có phải là một phép toán hợp lệ không
      if (sanitizedValue) {
        // Tính toán kết quả của biểu thức
        const result = eval(sanitizedValue);
        // Định dạng số và cập nhật giá trị hiển thị
        setValue(formatNumber(result)); // Cập nhật giá trị với biểu thức đã xử lý
      } else {
      }
    } catch (error) {
      // Nếu có lỗi xảy ra, hiển thị "Error"
    }
  };
  // Tính toán và cập nhật giá trị khi người dùng nhấn toán tử
  const handleOperatorClick = (operator) => {
    try {
      // Nếu giá trị đã có, tính toán kết quả
      let newValue = value;
      if (["+", "-", "*", "/"].includes(newValue[newValue.length - 1])) {
        newValue = newValue.slice(0, -1); // Loại bỏ toán tử cuối cùng nếu có
      }
      if (newValue) {
        const result = eval(newValue);
        setValue(result + operator);
      }
    } catch (error) {
      setValue("Error");
    }
  };
  const formatNumber = (num) => {
    const number = parseFloat(num);
    if (isNaN(number)) return "0";
    // Định dạng số với dấu chấm cho phân cách hàng nghìn
    const parts = number.toFixed(0).split(".");
    const integerPart = parts[0];
    // Thay dấu phân cách hàng nghìn bằng dấu chấm
    const formattedIntegerPart = integerPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      "."
    );
    return `${formattedIntegerPart}`;
  };
  // sự kiến nhập bằng bàn phím
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;
      const operators = "+-*/";
      if (key === "Enter") {
        e.preventDefault();
        handleEqual();
      } else if (key === "Backspace") {
        e.preventDefault();
        setValue(value.slice(0, -1));
      } else if (key === "Escape") {
        e.preventDefault();
        setValue("");
      } else if (key === "." || !isNaN(key)) {
        e.preventDefault();
        if (key === "." && !value.includes(".")) {
          setValue(value + key);
        } else if (!isNaN(key)) {
          setValue(value + key);
        }
      } else if (operators.includes(key)) {
        e.preventDefault();
        handleOperatorClick(key);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  // Button component
  const Button = ({ className, label, onClick }) => {
    return (
      <input
        className={className}
        type="button"
        value={label}
        onClick={onClick}
      />
    );
  };

  return (
    <div className="App">
      <div>
        <div className="container">
          <span ref={resultRef} className="result">
            {value || 0}
          </span>
        </div>
        <div className="container2">
          <div className="row">
            <Button
              className="button2"
              label={"0"}
              onClick={() => setValue(value + "0")}
            />
            <Button
              className="button"
              label={"."}
              onClick={() => setValue(value + ".")}
            />
            <Button
              className="button-action2"
              label={"="}
              onClick={handleEqual}
            />
          </div>
          <div className="row">
            <Button
              className="button"
              label={"1"}
              onClick={() => setValue(value + "1")}
            />
            <Button
              className="button"
              label={"2"}
              onClick={() => setValue(value + "2")}
            />
            <Button
              className="button"
              label={"3"}
              onClick={() => setValue(value + "3")}
            />
            <Button
              className="button-action2"
              label={"+"}
              onClick={() => handleOperatorClick("+")}
            />
          </div>
          <div className="row">
            <Button
              className="button"
              label={"4"}
              onClick={() => setValue(value + "4")}
            />
            <Button
              className="button"
              label={"5"}
              onClick={() => setValue(value + "5")}
            />
            <Button
              className="button"
              label={"6"}
              onClick={() => setValue(value + "6")}
            />
            <Button
              className="button-action2"
              label={"-"}
              onClick={() => handleOperatorClick("-")}
            />
          </div>
          <div className="row">
            <Button
              className="button"
              label={"7"}
              onClick={() => setValue(value + "7")}
            />
            <Button
              className="button"
              label={"8"}
              onClick={() => setValue(value + "8")}
            />
            <Button
              className="button"
              label={"9"}
              onClick={() => setValue(value + "9")}
            />
            <Button
              className="button-action2"
              label={"x"}
              onClick={() => handleOperatorClick("*")}
            />
          </div>
          <div className="row">
            <Button
              className="button-action"
              label={"AC"}
              onClick={() => setValue("")}
            />
            <Button
              className="button-action"
              label={"+/-"}
              onClick={() => {
                if (value.startsWith("-")) {
                  setValue(value.substring(1));
                } else {
                  setValue("-" + value);
                }
              }}
            />
            <Button
              className="button-action"
              label={"DE"}
              onClick={() => setValue(value.slice(0, -1))}
            />
            <Button
              className="button-action2"
              label={"÷"}
              onClick={() => handleOperatorClick("/")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
