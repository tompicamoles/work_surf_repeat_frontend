import React from "react";
import { Popover, Box, Button } from "@radix-ui/themes";
import { Cross1Icon } from "@radix-ui/react-icons";

function DeleteIcon(props) {
  return (
    <Box>
      <Popover.Root>
        <Popover.Trigger>
          <Cross1Icon />
        </Popover.Trigger>

        <Popover.Content>
          <div>
            <p>Do you want to delete this destination ?</p>
          </div>

          <Popover.Close className="PopoverClose" aria-label="Close">
            <Button onClick={props.deleteCard}>DELETE</Button>
          </Popover.Close>
        </Popover.Content>
      </Popover.Root>
    </Box>
  );
}

export default DeleteIcon;
