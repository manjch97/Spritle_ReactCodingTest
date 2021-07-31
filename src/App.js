import './App.css';
import { Button, Row, Col, Form, Container } from "react-bootstrap";
import React, { useEffect,useState } from "react";
function App() {
  const [balance,setBalance] = useState(0);
  const [transactions,setTransactions] = useState([]);
  const [validation,setValidation] = useState(null);
  const initialFormData = Object.freeze({
    expense: ""
  });

  const [formData, updateFormData] = React.useState(initialFormData);

  const changeHandler = (event) => {
    event.preventDefault();
    updateFormData({
      ...formData,
      [event.target.name]: event.target.value.trim()
    });
  };
  const inputHandler = (e) => {
    const { value, maxLength } = e.target;
    if (String(value).length >= maxLength) {
      e.preventDefault();
      return;
    }
  };
  const addBalance = (e)=>{
    e.preventDefault();
    if(formData.expense.length===0){
      setValidation("Please Enter Value To Add")
    }
    else{
      if(specialCharactersValidate() === true){
        setValidation("Invalid Expense")
      }
      else{
      setValidation(null);
      const addedAmount = balance+parseInt(formData.expense);
      setBalance(addedAmount);
      localStorage.setItem('Balance', addedAmount);
      let transactarray=transactions;
      let time = new Date().toISOString()
      transactarray.push({date:time,rupees:formData.expense,status:"Add"})
      setTransactions(transactarray);
      localStorage.setItem("transactionList", JSON.stringify(transactarray));
      }
    }
  }
  const specialCharactersValidate = () => {
    let format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if(format.test(formData.expense)){
      return true;
    } else {
      return false;
    }
  }
  const removeBalance = (e)=>{
    e.preventDefault();
    if(formData.expense.length===0){
      setValidation("Please Enter Value To Remove")
    }
    else{
      if(balance === 0 || balance<formData.expense){
        setValidation("Balance is not sufficient")
      }
      else if(specialCharactersValidate() === true){
        setValidation("Invalid Expense")
      }
      else{
      setValidation(null);
      const removedAmount = balance-parseInt(formData.expense);
      setBalance(removedAmount);
      localStorage.setItem('Balance', removedAmount);
      let transactarray=transactions;
      let time = new Date().toISOString()
      transactarray.push({date:time,rupees:formData.expense,status:"Remove"})
      setTransactions(transactarray);
      localStorage.setItem("transactionList", JSON.stringify(transactarray));
      }
    }
  }
  useEffect(() => {
    const totBal = parseInt(localStorage.getItem('Balance'));

    if (totBal) {
      setBalance(totBal);
    }
    const transList = JSON.parse(localStorage.getItem('transactionList'));
    if(transList){
      setTransactions(transList);
    }

  }, []);
  return (
    <Container className="py-5">
      <Row>
          <Col className="text-center fw-bold fs-35">Expense Tracker - Basic</Col>
      </Row>
      <Row className="pt-4">
        <Col xs={8} className="m-auto text-center border-black pt-3 pb-5 px-5">
            <div className="fw-bold fs-19">Balance : {balance}</div>
            <Form>
              <Form.Group className="my-3" controlId="inputExpense">
                <Form.Control type="number" placeholder="Enter expense"  maxLength="8"
                  onKeyPress={inputHandler}
                   name="expense"
                   onChange={changeHandler}/>
              </Form.Group>
              <div className="d-flex align-items-center justify-content-center">
                <div>
                  <Button variant="primary" onClick={addBalance}>
                    Add
                  </Button>
                </div>
                <div className="mx-2">
                  <Button variant="primary" onClick={removeBalance}>
                    Remove
                  </Button>
                </div>
              </div>
              <p className="text-danger">{validation}</p>
              
            </Form>
        </Col>
      </Row>
      <Row className="pt-4">
        <Col xs={8} className="m-auto text-left border-black pt-4 pb-5 px-5 transactionlist-scroll">
            <div className="fw-bold fs-19 pb-3 ">Transactions:</div>
            {transactions.length === 0 ? "No Transactions Yet" : 
            transactions.map((object, i) => 
            <div className="fw-bold fs-17" key={i}>{object.date} - {object.rupees} - {object.status}</div>
            )}
        </Col>
      </Row>
    </Container>
  );
}

export default App;
