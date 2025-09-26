import { renderHook, act } from '@testing-library/react';
import useScore from './useScore';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});


describe('useScore', () => {
  beforeEach(() => {
    // Clear all localStorage mocks before each test
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();

    // Setup default mock returns
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('should initialize with 0 stars and initial scores', () => {
    const { result } = renderHook(() => useScore());
    expect(result.current.stars).toBe(0);
    expect(result.current.scores.ones).toEqual(Array(6).fill(null));
  });

  it('should add a star', () => {
    const { result } = renderHook(() => useScore());
    act(() => {
      result.current.addStar();
    });
    expect(result.current.stars).toBe(1);
  });

  it('should remove a star', () => {
    const { result } = renderHook(() => useScore());
    act(() => {
      result.current.addStar();
    });
    act(() => {
      result.current.removeStar();
    });
    expect(result.current.stars).toBe(0);
  });

  it('should not remove a star if stars are 0', () => {
    const { result } = renderHook(() => useScore());
    act(() => {
      result.current.removeStar();
    });
    expect(result.current.stars).toBe(0);
  });

  it('should handle cell click and update score', () => {
    const { result } = renderHook(() => useScore());
    window.prompt = jest.fn(() => '1');
    window.alert = jest.fn();

    act(() => {
      result.current.handleCellClick('ones', 0);
    });
    expect(result.current.scores.ones[0]).toBe(1);
  });

  it('should validate straight row input', () => {
    const { result } = renderHook(() => useScore());
    window.prompt = jest.fn(() => '45'); // Invalid straight value
    window.alert = jest.fn();

    act(() => {
      result.current.handleCellClick('straight', 0);
    });
    expect(window.alert).toHaveBeenCalledWith('Value for straight must be 0, 46, 56 or 66');
    expect(result.current.scores.straight[0]).toBe(null);

    window.prompt = jest.fn(() => '46'); // Valid straight value
    act(() => {
      result.current.handleCellClick('straight', 0);
    });
    expect(result.current.scores.straight[0]).toBe(46);
  });

  it('should validate trilling row input', () => {
    const { result } = renderHook(() => useScore());
    window.prompt = jest.fn(() => '19'); // Invalid trilling value
    window.alert = jest.fn();

    act(() => {
      result.current.handleCellClick('trilling', 0);
    });
    expect(window.alert).toHaveBeenCalledWith('Invalid value for trilling');
    expect(result.current.scores.trilling[0]).toBe(null);

    window.prompt = jest.fn(() => '20'); // Valid trilling value
    act(() => {
      result.current.handleCellClick('trilling', 0);
    });
    expect(result.current.scores.trilling[0]).toBe(20);
  });

  it('should validate full row input', () => {
    const { result } = renderHook(() => useScore());
    window.prompt = jest.fn(() => '61'); // Invalid full value
    window.alert = jest.fn();

    act(() => {
      result.current.handleCellClick('full', 0);
    });
    expect(window.alert).toHaveBeenCalledWith('Value for full must be between 0 and 60');
    expect(result.current.scores.full[0]).toBe(null);

    window.prompt = jest.fn(() => '60'); // Valid full value
    act(() => {
      result.current.handleCellClick('full', 0);
    });
    expect(result.current.scores.full[0]).toBe(60);
  });

  it('should validate poker row input', () => {
    const { result } = renderHook(() => useScore());
    window.prompt = jest.fn(() => '39'); // Invalid poker value
    window.alert = jest.fn();

    act(() => {
      result.current.handleCellClick('poker', 0);
    });
    expect(window.alert).toHaveBeenCalledWith('Invalid value for poker');
    expect(result.current.scores.poker[0]).toBe(null);

    window.prompt = jest.fn(() => '40'); // Valid poker value
    act(() => {
      result.current.handleCellClick('poker', 0);
    });
    expect(result.current.scores.poker[0]).toBe(40);
  });

  it('should validate yamb row input', () => {
    const { result } = renderHook(() => useScore());
    window.prompt = jest.fn(() => '49'); // Invalid yamb value
    window.alert = jest.fn();

    act(() => {
      result.current.handleCellClick('yamb', 0);
    });
    expect(window.alert).toHaveBeenCalledWith('Invalid value for yamb');
    expect(result.current.scores.yamb[0]).toBe(null);

    window.prompt = jest.fn(() => '50'); // Valid yamb value
    act(() => {
      result.current.handleCellClick('yamb', 0);
    });
    expect(result.current.scores.yamb[0]).toBe(50);
  });

  it('should reset all scores and stars to initial state', () => {
    const { result } = renderHook(() => useScore());
    window.prompt = jest.fn();
    window.alert = jest.fn();

    // Add some scores and stars
    window.prompt = jest.fn(() => '5');
    act(() => {
      result.current.handleCellClick('ones', 0);
    });

    act(() => {
      result.current.addStar();
    });
    act(() => {
      result.current.addStar();
    });

    // Verify data was added
    expect(result.current.scores.ones[0]).toBe(5);
    expect(result.current.stars).toBe(2);

    // Reset everything
    act(() => {
      result.current.resetAll();
    });

    // Verify everything is back to initial state
    expect(result.current.scores.ones[0]).toBe(null);
    expect(result.current.scores.totalSum[0]).toBe(null);
    expect(result.current.stars).toBe(0);
    expect(result.current.calculateFinalResult()).toBe(0);
  });

  it('should save data to localStorage when scores or stars change', async () => {
    const { result } = renderHook(() => useScore());
    window.prompt = jest.fn();
    window.alert = jest.fn();

    // Wait for initial hydration
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Add a score
    window.prompt = jest.fn(() => '5');
    act(() => {
      result.current.handleCellClick('ones', 0);
    });

    // Add a star
    act(() => {
      result.current.addStar();
    });

    // Verify localStorage.setItem was called
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'yamb-scores',
      expect.stringContaining('"ones":[5,null,null,null,null,null]')
    );
    expect(localStorageMock.setItem).toHaveBeenCalledWith('yamb-stars', '1');
  });

  it('should load data from localStorage on initialization', () => {
    // Mock localStorage to return saved data
    const savedScores = {
      ones: [3, null, null, null, null, null],
      twos: [null, null, null, null, null, null],
      threes: [null, null, null, null, null, null],
      fours: [null, null, null, null, null, null],
      fives: [null, null, null, null, null, null],
      sixes: [null, null, null, null, null, null],
      sum1: [3, null, null, null, null, null],
      max: [null, null, null, null, null, null],
      min: [null, null, null, null, null, null],
      sum2: [null, null, null, null, null, null],
      trilling: [null, null, null, null, null, null],
      straight: [null, null, null, null, null, null],
      full: [null, null, null, null, null, null],
      poker: [null, null, null, null, null, null],
      yamb: [null, null, null, null, null, null],
      totalSum: [3, null, null, null, null, null]
    };

    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'yamb-scores') return JSON.stringify(savedScores);
      if (key === 'yamb-stars') return '2';
      return null;
    });

    const { result } = renderHook(() => useScore());

    // Verify data was loaded
    expect(result.current.scores.ones[0]).toBe(3);
    expect(result.current.stars).toBe(2);
  });

});
