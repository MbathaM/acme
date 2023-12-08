import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/sheet';
import { Badge } from '@nextui-org/badge';
import { Button } from '@nextui-org/button';
import { Link } from '@nextui-org/link';
import { button as buttonStyles } from '@nextui-org/theme';
import Image from 'next/image';
import { ShoppingBag } from './icons';

export function Cart() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Badge content='5' color='primary'>
          <Button isIconOnly className='bg-transparent' aria-label='cart'>
            <ShoppingBag className='h-6 w-6' />
          </Button>
        </Badge>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader></SheetHeader>
        <div className='flex h-full flex-col items-center justify-center space-y-1'>
          <div
            aria-hidden='true'
            className='relative mb-4 h-60 w-60 text-muted-foreground'
          >
            <Image
              src='/calf-empty-cart.png'
              fill
              alt='empty shopping cart hippo'
            />
          </div>
          <div className='text-xl font-semibold'>Your cart is empty</div>
          <SheetTrigger asChild>
            <Link
              href='/products'
              className={buttonStyles({
                variant: 'flat',
                size: 'sm',
                className: 'text-sm text-muted-foreground',
              })}
            >
              Add items to your cart to checkout
            </Link>
          </SheetTrigger>
        </div>
      </SheetContent>
    </Sheet>
  );
}
