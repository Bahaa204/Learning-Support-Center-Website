import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import type { Item as ItemType } from "@/types/types";

type ItemAvatarProps = {
  items: ItemType[];
};

export function ItemAvatar({ items }: ItemAvatarProps) {
  return (
    <div className='flex w-full max-w-lg flex-col gap-6'>
      {items.map((item) => {
        const Initials =
          item.name
            .split(" ")
            .map((name) => name[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) || "";

        return (
          <Item variant='outline'>
            <ItemMedia>
              <Avatar className='size-10'>
                <AvatarImage src={item.avatar} />
                <AvatarFallback>{Initials}</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{item.name}</ItemTitle>
              <ItemDescription>
                {item.description}
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              {item.actions.map((action) => (
                <Button
                  size='icon-xs'
                  variant='outline'
                  className='rounded-full'
                >
                  <a href={action.link} target='_blank'>
                    <ItemMedia>
                      <Avatar>
                        <AvatarImage src={action.icon} alt={action.name} />
                        <AvatarFallback>{action.name}</AvatarFallback>
                      </Avatar>
                    </ItemMedia>
                  </a>
                </Button>
              ))}
            </ItemActions>
          </Item>
        );
      })}
    </div>
  );
}
