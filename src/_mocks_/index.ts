import { writeBlogDto } from 'src/blogs/dto/write-blog.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Readable } from 'stream';

export const user: CreateUserDto = {
  firstName: 'John',
  lastName: 'Doe',
  nickName: 'Johnny',
  userName: 'johnd',
  languages: ['English', 'Spanish'],
  dob: new Date('2020-10-10'),
  email: 'johnd@example.com',
  telegramUserName: 'john_telegram',
  phoneNumber: '1234567890',
  vkId: 'john_vk',
  facebookId: 'john_fb',
  weChatId: 'john_wechat',
  instagramUserName: 'john_insta',
  country: 'USA',
  state: 'California',
  password: 'securePassword123!',
  referalId: 'ref123',
  sex: 'male',
  city: 'city',
};

export const blogDto = {
  title: 'here and there koo',
  content: 'This blog post explains how decorators work in TypeScript...',
  references: ['this', 'that'],
  tags: ['type', 'nest'],
} as writeBlogDto;

export const blogNoRefDto = {
  title: 'Blog with out ref',
  content: 'This blog post explains how decorators work in TypeScript...',
  tags: ['type', 'nest'],
} as writeBlogDto;

export const mockUserRepository = {
  findByEmail: jest.fn(),
  create: jest.fn(),
  findByUserName: jest.fn(),
  updateRefreshToken: jest.fn(),
  findOne: jest.fn(),
  updateUser: jest.fn(),
};

export const mockBlogRepository = {
  findBlogByTitle: jest.fn(),
  getDisLike: jest.fn(),
  updateBlog: jest.fn(),
  findByEmail: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
  deleteReaction: jest.fn(),
};

export const mockCloudStorageService = {
  uploadFile: jest.fn(),
  removeFile: jest.fn(),
};

export const mockPrismaService = {};

export const mockFile = {
  fieldname: 'image',
  originalname: 'avatar.png',
  encoding: '7bit',
  mimetype: 'image/png',
  size: 1024,
  buffer: Buffer.from('image data'),
  destination: '',
  filename: '',
  path: '',
  stream: new Readable(), // Mock a Readable stream
};
