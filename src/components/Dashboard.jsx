import { useEffect, useState } from "react";
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
import { Button } from "./components/ui/button";
import { formatTimeDiff } from "../utils/formatTimeDiff";
import { Loader2, TriangleAlert } from "lucide-react";

export default function Dashboard() {
  const [squads, setSquads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [squadType, setSquadType] = useState("All");

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
    return (
      <div className="w-full h-full my-auto flex justify-center items-center">
        <Loader2 className="w-10 h-10 mt-40  animate-spin" />
      </div>
    );
  }

  if (squads.length === 0) {
    return (
      <div className="w-full h-full my-auto flex justify-center items-center">
        <div className="flex flex-col items-center mt-40">
          <TriangleAlert className="w-10 h-10 " />
          <p className="text-2xl font-bold">No Data Available 😥</p>
        </div>
      </div>
    );
  }

  const filteredSquads = squads.filter((squad) => {
    switch (squadType) {
      case "Single":
        return squad.players.length === 1;
      case "Squad":
        return squad.players.length === 4;
      case "Duo":
        return squad.players.length === 2;
      case "Triple":
        return squad.players.length === 3;
      default:
        return true;
    }
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Squad Dashboard</h1>
      <div className="flex space-x-2 mb-4">
        <Button
          variant={squadType === "Single" ? "default" : "outline"}
          onClick={() => setSquadType("Single")}
        >
          Single
        </Button>
        <Button
          variant={squadType === "Squad" ? "default" : "outline"}
          onClick={() => setSquadType("Squad")}
        >
          Squad
        </Button>
        <Button
          variant={squadType === "Duo" ? "default" : "outline"}
          onClick={() => setSquadType("Duo")}
        >
          Duo
        </Button>
        <Button
          variant={squadType === "Triple" ? "default" : "outline"}
          onClick={() => setSquadType("Triple")}
        >
          Triple
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredSquads.map((squad) => (
          <Card key={squad.id}>
            <CardHeader>
              <CardTitle>Squad {squad.id}</CardTitle>
              <p>Created At: {formatTimeDiff(squad.createdAt)} ago</p>
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
