import { siteConfig } from '@/config/site';
import { getServerSideUser } from '@/lib/payload-utils';
import { Input } from '@nextui-org/input';
import { Kbd } from '@nextui-org/kbd';
import { Link } from '@nextui-org/link';
import {
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Navbar as NextUINavbar,
} from '@nextui-org/navbar';
import { button as buttonStyles, link as linkStyles } from '@nextui-org/theme';
import clsx from 'clsx';
import { cookies } from 'next/headers';
import NextLink from 'next/link';

import { GithubIcon, SearchIcon } from '@/components/icons';
import { ThemeSwitch } from '@/components/theme-switch';

import { Logo } from '@/components/icons';
import { Cart } from './cart';
import { UserAccountNav } from './user-account-nav';

export const Navbar = async () => {
  const nextCookies = cookies();
  const { user } = await getServerSideUser(nextCookies);
  const searchInput = (
    <Input
      aria-label='Search'
      classNames={{
        inputWrapper: 'bg-default-100',
        input: 'text-sm',
      }}
      endContent={
        <Kbd className='hidden lg:inline-block' keys={['command']}>
          K
        </Kbd>
      }
      labelPlacement='outside'
      placeholder='Search...'
      startContent={
        <SearchIcon className='pointer-events-none flex-shrink-0 text-base text-default-400' />
      }
      type='search'
    />
  );

  return (
    <NextUINavbar maxWidth='xl' position='sticky'>
      <NavbarContent className='basis-1/5 sm:basis-full' justify='start'>
        <NavbarBrand as='li' className='max-w-fit gap-3'>
          <NextLink className='flex items-center justify-start gap-1' href='/'>
            <Logo />
            <p className='font-bold text-inherit'>ACME</p>
          </NextLink>
        </NavbarBrand>
        <ul className='ml-2 hidden justify-start gap-4 lg:flex'>
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: 'foreground' }),
                  'data-[active=true]:font-medium data-[active=true]:text-primary'
                )}
                color='foreground'
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className='hidden basis-1/5 sm:flex sm:basis-full'
        justify='end'
      >
        <NavbarItem className='hidden gap-2 sm:flex'>
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className='hidden lg:flex'>{searchInput}</NavbarItem>
        <NavbarItem>
          {' '}
          <Cart />{' '}
        </NavbarItem>
        {user ? null : (
          <NavbarItem className='hidden md:flex'>
            <Link
              href='/sign-in'
              className={buttonStyles({
                color: 'primary',
                radius: 'lg',
                variant: 'light',
              })}
            >
              Sign in
            </Link>
          </NavbarItem>
        )}
        {user ? (
          <NavbarItem className='hidden md:flex'>
            <UserAccountNav user={user} />
          </NavbarItem>
        ) : (
          <NavbarItem className='hidden md:flex'>
            <Link
              href='/sign-up'
              className={buttonStyles({
                color: 'primary',
                radius: 'lg',
                variant: 'flat',
              })}
            >
              Create account
            </Link>
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarContent className='basis-1 pl-4 sm:hidden' justify='end'>
        <Link isExternal href={siteConfig.links.github} aria-label='Github'>
          <GithubIcon className='text-default-500' />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        {searchInput}
        <div className='mx-4 mt-2 flex flex-col gap-2'>
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? 'primary'
                    : index === siteConfig.navMenuItems.length - 1
                      ? 'danger'
                      : 'foreground'
                }
                href='#'
                size='lg'
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
