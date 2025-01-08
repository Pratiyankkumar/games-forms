import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Button } from "./components/ui/button";
import { Alert, AlertDescription } from "./components/ui/alert";
import { Loader2 } from "lucide-react";

export default function Form() {
  const [formData, setFormData] = useState({
    players: [
      { name: "", gameUid: "" },
      { name: "", gameUid: "" },
      { name: "", gameUid: "" },
      { name: "", gameUid: "" },
    ],
    email: "",
  });

  const [errors, setErrors] = useState({
    players: [
      { name: "", gameUid: "" },
      { name: "", gameUid: "" },
      { name: "", gameUid: "" },
      { name: "", gameUid: "" },
    ],
    email: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const validateEmail = (email) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleInputChange = (index, field, value) => {
    const updatedPlayers = [...formData.players];
    updatedPlayers[index] = { ...updatedPlayers[index], [field]: value };

    // Clear error when user starts typing
    const updatedErrors = [...errors.players];
    updatedErrors[index] = { ...updatedErrors[index], [field]: "" };

    setFormData((prevState) => ({
      ...prevState,
      players: updatedPlayers,
    }));

    setErrors((prevState) => ({
      ...prevState,
      players: updatedErrors,
    }));
  };

  const handleemailChange = (e) => {
    const value = e.target.value;
    setFormData((prevState) => ({
      ...prevState,
      email: value,
    }));
    setErrors((prevState) => ({
      ...prevState,
      email: "",
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      players: [
        { name: "", gameUid: "" },
        { name: "", gameUid: "" },
        { name: "", gameUid: "" },
        { name: "", gameUid: "" },
      ],
      email: "",
    };

    // Validate players
    formData.players.forEach((player, index) => {
      if (!player.name.trim()) {
        newErrors.players[index].name = "Name is required";
        isValid = false;
      }
      if (!player.gameUid.trim()) {
        newErrors.players[index].gameUid = "Game UID is required";
        isValid = false;
      }
    });

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const req = await fetch(
          "https://games-forms-backend.onrender.com/submit",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        if (req.status === 200) {
          showNotification("Form submitted successfully!", "success");
          // Optionally reset form here
          setFormData({
            players: [
              { name: "", gameUid: "" },
              { name: "", gameUid: "" },
              { name: "", gameUid: "" },
              { name: "", gameUid: "" },
            ],
            email: "",
          });
        } else {
          showNotification(
            "An error occurred while submitting the form.",
            "error"
          );
        }
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        showNotification(
          "An error occurred while submitting the form.",
          "error"
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center z-0 bg-white justify-center p-4">
      <div className="absolute inset-0"></div>
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-4">
          <Alert
            className={`w-96 ${
              notification.type === "success"
                ? "bg-green-100 border-green-500"
                : "bg-red-100 border-red-500"
            }`}
          >
            <AlertDescription
              className={
                notification.type === "success"
                  ? "text-green-800"
                  : "text-red-800"
              }
            >
              {notification.message}
            </AlertDescription>
          </Alert>
        </div>
      )}
      <Card className="w-full max-w-2xl mx-auto z-10 backdrop-blur-sm relative">
        {/* Keep existing CardHeader */}
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-purple-600">
            Free fire gaming form
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Enter details for all players
          </CardDescription>
        </CardHeader>

        {/* Keep existing QR code section */}
        <div className="flex justify-center mb-6">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <img
              src="./qr.jpeg"
              alt="Game QR Code"
              className="w-48 h-52 object-cover"
            />
            <p className="text-center mt-2 text-sm text-gray-600">
              Pay to join the game
            </p>
          </div>
        </div>

        {/* Keep existing CardContent with form fields */}
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-6">
              {formData.players.map((player, index) => (
                <div key={index} className="space-y-4">
                  <h3 className="text-lg font-semibold text-purple-600">
                    Player {index + 1}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor={`player${index + 1}Name`}>Name</Label>
                      <Input
                        id={`player${index + 1}Name`}
                        value={player.name}
                        onChange={(e) =>
                          handleInputChange(index, "name", e.target.value)
                        }
                        placeholder="Enter player name"
                        className={`bg-white/50 backdrop-blur-sm ${
                          errors.players[index].name ? "border-red-500" : ""
                        }`}
                      />
                      {errors.players[index].name && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.players[index].name}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor={`player${index + 1}GameUid`}>
                        Game UID
                      </Label>
                      <Input
                        id={`player${index + 1}GameUid`}
                        value={player.gameUid}
                        onChange={(e) =>
                          handleInputChange(index, "gameUid", e.target.value)
                        }
                        placeholder="Enter game UID"
                        className={`bg-white/50 backdrop-blur-sm ${
                          errors.players[index].gameUid ? "border-red-500" : ""
                        }`}
                      />
                      {errors.players[index].gameUid && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.players[index].gameUid}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleemailChange}
                  placeholder="Enter your email address"
                  className={`bg-white/50 backdrop-blur-sm ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2 text-lg font-semibold transition-all duration-200 ease-in-out transform hover:scale-105"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
