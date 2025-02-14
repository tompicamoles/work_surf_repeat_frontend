import DeleteIcon from "../components/DeleteIcon";

function DeleteContainer(props) {


  function deleteCard() {
    console.log(props.id);

    const url = `https://api.airtable.com/v0/appEifpsElq8TYpAy/Table%201/${props.id}`;
    const token =
      "Bearer patsL0oBwMroW70T7.86828429085137c56a7993317233085e045e0924c348253c60cb8c1b9508d71c"; // Replace with your actual API key

    fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        props.updateData();
        ;
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  return <DeleteIcon deleteCard={deleteCard} />;
}

export default DeleteContainer;

console.log("test")
