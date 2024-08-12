import Quote from "../model/quote.js";

export const newQuote = async (req, res) => {
  try {
    const { name, email, phone, option } = req.body;
    if (!name) {
      return res.send({
        success: false,
        message: "name is required",
      });
    }
    if (!email) {
      return res.send({
        success: false,
        message: "email is required",
      });
    }
    if (!phone) {
      return res.send({
        success: false,
        message: "phone is required",
      });
    }
    if (!option) {
      return res.send({
        success: false,
        message: "option is required",
      });
    }
    const data = await new Quote({ ...req.body }).save();
    res.status(200).send({
      success: true,
      message: "Thank you for showing your interest. We will contact you soon.",
      data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "failed to add query",
      error,
    });
  }
};
export const getQuotes = async (req, res) => {
  try {
    const queries = await Quote.find();

    // Map over the queries to add the formatted date
    const formattedQueries = queries.map((query) => ({
      ...query._doc,
      date: new Date(query.createdAt).toLocaleDateString("en-US"),
    }));

    res.status(200).json({
      success: true,
      message: "All queries fetched",
      data: formattedQueries,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a query by ID
export const getQuoteById = async (req, res) => {
  try {
    const query = await Quote.findById(req.params.id);
    if (!query) {
      return res.status(404).json({ message: "Query not found" });
    }
    res.status(200).json(query);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a query
export const updateQuery = async (req, res) => {
  try {
    const updatedQuery = await Quote.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedQuery) {
      return res.status(404).json({ message: "Query not found" });
    }
    res.status(200).json(updatedQuery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a query
export const deleteQuote = async (req, res) => {
  try {
    const deletedQuery = await Quote.findByIdAndDelete(req.params.id);
    if (!deletedQuery) {
      return res.status(404).json({ message: "Query not found" });
    }
    res.status(200).json({ message: "Query deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateQuoteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const query = await Quote.findById(id);
    if (!query) {
      return res.status(404).json({ message: "Query not found" });
    }

    query.status = status;
    await query.save();
    res.status(200).json(query);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
