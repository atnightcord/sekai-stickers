import {Popover, Button, Flex, Avatar, Box, Heading, Text, Link} from "@radix-ui/themes";
import MyAvatar from '../assets/099d3de4d96d0929.jpg';

// eslint-disable-next-line react/prop-types
export default function Info() {
  return (
    <div className="font-sans">
      <Popover.Root>
        <Popover.Trigger>
          <Button size="3" color="secondary">
            INFO
          </Button>
        </Popover.Trigger>
        <Popover.Content className="max-w-[90vw]">
          <Flex gap="4">
            <Avatar
                size="3"
                fallback="M"
                radius="full"
                src={MyAvatar}
            />
            <Box className="font-sans">
              <Heading size="3" as="h3">
               Contributor: Mizuki Akiyama
              </Heading>
              <Link as="div" size="2" color="gray" href="https://nightcord.de/@akiyamamizuki">
                @akiyamamizuki@nightcord.de
              </Link>

              <Text as="div" size="2" style={{ maxWidth: 300 }} mt="3">
                This version is modified from the <Link href="https://st.ayaka.one/">original version</Link> by @ayaka.
              </Text>
              <Text as="div" size="2" style={{ maxWidth: 300 }} mt="3">
                GitHub Repo: <Link href="https://github.com/atnightcord/sekai-stickers">https://github.com/atnightcord/sekai-stickers</Link>
              </Text>
            </Box>
          </Flex>
        </Popover.Content>
      </Popover.Root>
    </div>
  );
}
