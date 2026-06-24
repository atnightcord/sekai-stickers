import {
  Popover,
  Button,
  Flex,
  Avatar,
  Box,
  Heading,
  Text,
  Link,
} from "@radix-ui/themes";

export default function Info() {
  return (
    <div>
      <Popover.Root>
        <Popover.Trigger>
          <Button size="3" variant="soft" color="gray">
            About
          </Button>
        </Popover.Trigger>
        <Popover.Content className="info-popover">
          <Flex gap="4">
            <Avatar
              size="3"
              fallback="M"
              radius="none"
              src="https://avatars.githubusercontent.com/u/13678847?v=4"
            />
            <Box>
              <Heading size="3" as="h3">
                Contributor: Mikan Harada
              </Heading>
              <Link
                as="div"
                size="2"
                color="gray"
                href="https://nightcord.de/@akiyamamizuki"
              >
                @akiyamamizuki@nightcord.de
              </Link>

              <Text as="div" size="2" style={{ maxWidth: 300 }} mt="3">
                This version is modified from the{" "}
                <Link href="https://st.ayaka.one/">original version</Link> by
                @ayaka.
              </Text>
              <Text as="div" size="2" style={{ maxWidth: 300 }} mt="3">
                GitHub Repo:{" "}
                <Link href="https://github.com/atnightcord/sekai-stickers">
                  github.com/atnightcord/sekai-stickers
                </Link>
              </Text>
              <Text as="div" size="2" style={{ maxWidth: 300 }} mt="3">
                Stickers are community collected. If there is any infringement,
                please contact me for removal. If you want to contribute
                stickers, open an issue or PR in the repo.
              </Text>
            </Box>
          </Flex>
        </Popover.Content>
      </Popover.Root>
    </div>
  );
}
