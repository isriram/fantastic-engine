import { Card, Container } from "@mantine/core";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
	return [{ title: "Radiant" }, { name: "description", content: "Welcome to Remix!" }];
};

export default function Index() {
	return (
		<Container>
			<Card>This is an index page</Card>
		</Container>
	);
}
