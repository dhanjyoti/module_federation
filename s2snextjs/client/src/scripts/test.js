const Test = (req, res)=>{
    const user = {
        id: 1337,
        name: "dhanjyoti",
        company: "Gupshup",
    }
    res.status(200).json(user);
}

export default Test;