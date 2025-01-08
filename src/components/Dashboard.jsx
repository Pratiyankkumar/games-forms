import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import { Avatar, AvatarFallback } from "./components/ui/avatar";
import { useEffect, useState } from "react";

// Mock data for squads
// const squads = [
//   {
//     id: 1,
//     email: "squad1@example.com",
//     players: [
//       { name: "John Doe", uid: "JD001" },
//       { name: "Jane Smith", uid: "JS002" },
//       { name: "Bob Johnson", uid: "BJ003" },
//       { name: "Alice Brown", uid: "AB004" },
//     ],
//   },
//   {
//     id: 2,
//     email: "squad2@example.com",
//     players: [
//       { name: "Emma Wilson", uid: "EW005" },
//       { name: "Michael Lee", uid: "ML006" },
//       { name: "Olivia Davis", uid: "OD007" },
//       { name: "William Taylor", uid: "WT008" },
//     ],
//   },

//   // Add more squads as needed
// ];

export default function Dashboard() {
  const [squads, setSquads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchSquad() {
      setIsLoading(true);
      const req = await fetch(
        "https://games-forms-backend.onrender.com/getSquads"
      );

      const res = await req.json();

      setSquads(res);
      console.log(res);

      if (req.status === 200) {
        setIsLoading(false);
      }
    }

    fetchSquad();
  }, []);

  if (isLoading) {
    return isLoading && <p>Loading</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Squad Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {squads.map((squad) => (
          <Card key={squad.id}>
            <CardHeader>
              <CardTitle>Squad {squad.id}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Email: {squad.email}
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Avatar</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>UID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {squad?.players?.map((player) => (
                    <TableRow key={player.uId}>
                      <TableCell>
                        <Avatar>
                          <AvatarFallback>
                            {player.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell>{player.name}</TableCell>
                      <TableCell>{player.uId}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
